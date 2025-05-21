use std::collections::BTreeMap;

use actix_web::{App, HttpResponse, HttpServer, Responder, get, web};
use chrono::{DateTime, Local, NaiveDateTime, TimeZone};
use serde::{Deserialize, Serialize};

const TEST_TIME: &str = "09:20:00";
const FILE_PATH: &str = "gsat_date.json";

#[derive(Serialize)]
struct TimeResponse {
    days: i64,
    hours: i64,
    minutes: i64,
    seconds: i64,
}

#[derive(Deserialize)]
struct TimeQuery {
    year: Option<i32>, // Year is optional, defaults to 2022
}

fn get_gsat_date(year: i32) -> Result<String, String> {
    let file_content = std::fs::read_to_string(FILE_PATH)
        .map_err(|e| format!("Failed to read {}: {}", FILE_PATH, e))?;

    let map: BTreeMap<i32, String> =
        serde_json::from_str(&file_content).map_err(|e| format!("Failed to parse JSON: {}", e))?;

    let date = map
        .get(&year)
        .ok_or_else(|| format!("No date found for year {}", year))?;

    Ok(date.clone())
}

fn gsat_timer(date: &str) -> Result<NaiveDateTime, String> {
    let date_time = format!("{} {}", date, TEST_TIME);
    NaiveDateTime::parse_from_str(&date_time, "%Y-%m-%d %H:%M:%S")
        .map_err(|e| format!("Failed to parse date {}: {}", date_time, e))
}

#[get("/api/remaining-time")]
async fn remaining_time(query: web::Query<TimeQuery>) -> impl Responder {
    let year = query.year.unwrap_or(2022);

    match get_gsat_date(year) {
        Ok(date) => match gsat_timer(&date) {
            Ok(dt) => {
                let dt_local: DateTime<Local> = Local.from_local_datetime(&dt).unwrap();
                let current_time: DateTime<Local> = Local::now();
                let duration = current_time - dt_local;

                let seconds = duration.num_seconds().abs();
                let days = seconds / (24 * 3600);
                let hours = (seconds % (24 * 3600)) / 3600;
                let minutes = (seconds % 3600) / 60;
                let seconds_remainder = seconds % 60;

                HttpResponse::Ok().json(TimeResponse {
                    days,
                    hours,
                    minutes,
                    seconds: seconds_remainder,
                })
            }
            Err(e) => HttpResponse::BadRequest().body(e),
        },
        Err(e) => HttpResponse::BadRequest().body(e),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(remaining_time)
            .service(actix_files::Files::new("/", "./static").index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
