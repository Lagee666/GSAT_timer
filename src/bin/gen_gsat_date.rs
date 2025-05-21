use std::collections::BTreeMap;

use chrono::{Datelike, Duration, NaiveDate, Weekday};

fn get_second_last_saturday_in_january(year: i32) -> NaiveDate {
    let mut date = NaiveDate::from_ymd_opt(year, 1, 31).unwrap();

    while date.weekday() != Weekday::Sat {
        date -= Duration::days(1);
    }
    let last_saturday = date;

    last_saturday - Duration::days(7)
}

fn main() {
    let mut map = BTreeMap::new();
    for year in 1995..=2100 {
        let date = get_second_last_saturday_in_january(year);
        map.insert(year, date.to_string());
    }

    let file_path = "gsat_date.json";
    let content = serde_json::to_string(&map).unwrap();
    std::fs::write(file_path, content).unwrap();
}
