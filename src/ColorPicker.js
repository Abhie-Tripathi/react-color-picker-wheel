import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles/ColorPicker.css";
import PropTypes from "prop-types";
import ColorWheel from "./ColorWheel";
import { convertToStdColorFormat, hslToRgb, rgbToHex } from "./helpers/utils";

const defaultColor = {
  hex: "#FF0000",
  rgb: { r: 255, g: 0, b: 0 },
  hsl: { h: 0, s: 100, l: 50 },
};

const ColorPicker = ({
  size,
  initialColor,
  onChange,
  actionRef,
  controlers,
}) => {
  const [pickedColor, setPickedColor] = useState(defaultColor);

  const pickedColorRef = useRef();
  pickedColorRef.current = pickedColor;

  const onChangeRef = useRef();
  onChangeRef.current = onChange;

  useEffect(() => {
    initialColor = initialColor || defaultColor.hex;
    try {
      const colors = convertToStdColorFormat(initialColor);
      setPickedColor(colors);
    } catch (error) {
      console.error(error);
      setPickedColor(defaultColor);
    }
  }, []);

  if (actionRef) {
    actionRef.current = {
      updateColor: function updateColor(color) {
        try {
          const formatedColor = convertToStdColorFormat(color);
          setPickedColor(formatedColor);
        } catch (error) {
          console.error(error);
        }
      },
    };
  }

  const setColorFromWheel = useCallback((hsl) => {
    if (typeof hsl === "function") {
      hsl = hsl(pickedColorRef.current.hsl);
    }
    const pickedColor = pickedColorRef.current;
    const h = parseFloat(
      (hsl.h === undefined ? pickedColor.hsl.h : hsl.h).toFixed(2)
    );
    const s = parseFloat(
      (hsl.s === undefined ? pickedColor.hsl.s : hsl.s).toFixed(2)
    );
    const l = parseFloat(
      (hsl.l === undefined ? pickedColor.hsl.l : hsl.l).toFixed(2)
    );
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setPickedColor({ hex, rgb, hsl: { h, s, l } });

    if (onChangeRef.current) {
      onChangeRef.current({ hex, rgb, hsl: { h, s, l } });
    }
  }, []);

  return (
    <div>
      <div
        className="outerContainer"
        style={{
          height: size,
          width: size,
        }}
      >
        <ColorWheel
          color={pickedColor.hsl}
          size={size}
          setColor={setColorFromWheel}
          controlers={controlers}
        />
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  /** Size of the container in pixels (Container is a square). */
  size: PropTypes.number,
  /** Color to render onto color wheel. It can be hex(#ffffff) or rgb object({r:0, g:0, b:0}). */
  initialColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      h: PropTypes.number,
      s: PropTypes.number,
      l: PropTypes.number,
    }),
    PropTypes.shape({
      r: PropTypes.number,
      g: PropTypes.number,
      b: PropTypes.number,
    }),
  ]),
  /** Function which will be called when color change occurs. Parameter is a hsl object */
  onChange: PropTypes.func,
  actionRef: PropTypes.shape({ current: PropTypes.any }),
  controlers: PropTypes.shape({
    saturationControler: PropTypes.bool,
    lightnessControler: PropTypes.bool,
  }),
};

ColorPicker.defaultProps = {
  size: 100,
  initialColor: "#FF0000",
  onChange: () => {},
  actionRef: null,
  controlers: {
    saturationControler: true,
    lightnessControler: true,
  },
};

export default ColorPicker;
