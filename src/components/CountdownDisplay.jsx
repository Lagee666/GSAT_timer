import PropTypes from 'prop-types';

function CountdownDisplay({ timeLeft }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl mb-4">學測倒數</h1>
      <div className="grid grid-cols-4 gap-4 text-xl">
        <div>
          <span className="text-3xl font-bold">{timeLeft.days}</span> 天
        </div>
        <div>
          <span className="text-3xl font-bold">{timeLeft.hours}</span> 小時
        </div>
        <div>
          <span className="text-3xl font-bold">{timeLeft.minutes}</span> 分鐘
        </div>
        <div>
          <span className="text-3xl font-bold">{timeLeft.seconds}</span> 秒
        </div>
      </div>
    </div>
  );
}

CountdownDisplay.propTypes = {
  timeLeft: PropTypes.shape({
    days: PropTypes.number,
    hours: PropTypes.number,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
    isEnded: PropTypes.bool,
  }).isRequired,
};

export default CountdownDisplay;