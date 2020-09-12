import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import './styles/LevelBar.css';
import mask from './assets/mask.svg';

const LevelBar = ({
  alignRight,
  className,
  handleClassName,
  size,
  background,
  onChange,
  value,
}) => {
  const bar = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const mouseDown = event => {
      if (bar.current.contains(event.target)) {
        setEditing(true);
      }
    };
    const mouseMove = event => {
      if (editing) {
        // Y coordinate difference as [0,1] (0 is full saturation)
        const yDifference = event.clientY - bar.current.getBoundingClientRect().y;
        const s = (1 - Math.min(size, Math.max(0, yDifference)) / size) * 100;
        onChange(parseFloat(s.toFixed(2)));
      }
    };
    const mouseUp = () => setEditing(false);

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [editing, onChange, size]);

  const indicatorPosition = useMemo(() => {
    const top = size * (0.6 * (1 - Math.sin(Math.asin(3 / 4) * (value / 50 - 1))) - 1 / 10);
    const horizontal = size * 0.65 * (1 - Math.cos(Math.asin(3 / 4) * (value / 50 - 1)));
    return { top, horizontal };
  }, [value, size]);

  const crossBrowserBar = useMemo(() => {
    if (typeof InstallTrigger !== 'undefined') { // isFirefox
      return (
        <div
          className="barBackground"
          style={{
            maskImage: `url(${mask})`,
            maskSize: 'contain',
            background,
            marginTop: size / 20,
          }}
        />
      );
    }
    return (
      <svg
        className="barBackground"
        width="100%"
        height="90%"
        style={{
          background,
          marginTop: size / 20,
        }}
        clipPath="url(#clipBar)"
      >
        <clipPath id="clipBar" clipPathUnits="objectBoundingBox">
          <path
            d="M0.796,1 C0.308,0.878,0,0.699,0,0.5 C0,0.301,0.308,0.122,0.796,0 H1 C0.504,0.122,0.19,0.303,0.19,0.504 C0.19,0.701,0.49,0.878,0.968,1 H0.796"
          />
        </clipPath>
      </svg>
    );
  }, [background, size]);

  return (
    <div
      ref={bar}
      className={className}
      style={{
        position: 'absolute',
        height: size,
        width: size * 0.281,
        transform: alignRight ? 'scaleX(-1)' : '',
        cursor: 'grab',
      }}
    >
      {crossBrowserBar}
      <div
        className={handleClassName}
        style={{
          top: indicatorPosition.top,
          left: indicatorPosition.horizontal,
          width: size * 0.05,
          height: size * 0.05,
          border: `${size * 0.005}px solid black`,
        }}
      />
    </div>
  );
};

LevelBar.propTypes = {
  /** Whether bar is aligned to right */
  alignRight: PropTypes.bool,
  /** Css class name for outer div */
  className: PropTypes.string,
  /** Css class name for handle */
  handleClassName: PropTypes.string,
  /** Background in css format */
  background: PropTypes.string,
  /** height of the bar */
  size: PropTypes.number.isRequired,
  /** zero saturation color string in css hsl format (hsl(0, 5%, 10%)). */
  onChange: PropTypes.func,
  /** current value level ([0,100]) */
  value: PropTypes.number,
};

LevelBar.defaultProps = {
  alignRight: false,
  className: 'levelBar',
  handleClassName: 'defaultHandle',
  background: 'black',
  onChange: (() => {}),
  value: 100,
};
export default LevelBar;
