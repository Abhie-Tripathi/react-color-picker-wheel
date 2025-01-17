# react-color-picker-wheel

Color picker component for React.js using color wheel

[![npm version](https://badge.fury.io/js/react-color-picker-wheel.svg)](https://badge.fury.io/js/react-color-picker-wheel)

![demo](./media/example.gif)

Demo can be found here: https://ahmethalac.github.io/react-color-picker-wheel/

## Installation

> npm install https://github.com/prabeen04/react-color-picker-wheel.git#horizontal-bar  
> yarn add https://github.com/prabeen04/react-color-picker-wheel.git#horizontal-bar

## Usage

```javascript
import ColorPicker from 'react-color-picker-wheel';

// ...
return <ColorPicker
    initialColor="#FF0000"
    onChange={(color => console.log(color))}
    actionRef={ref}
    size={300}
    controlers={{
        saturationControler: true
        lightnessControler: true
    }}
/>;
```

## Properties

| Name | Type | Default Value | Description
| ---- | ---- | ------------- | -----------
| initialColor | ```Hex``` | ```"#FF0000"``` | Color to render onto color wheel. It can be hex(#ffffff) or rgb object ({r:0, g:0, b:0})
| onChange | ```func``` | ```()=>{}``` | Function which will be called when color change occurs. Function parameter is a color object
| size | ```number``` | ```100``` | Size of the container in pixels (Container is a square)
| controlers | ```{saturationControler: boolen, lightnessControler: boolean}``` | ```{saturationControler: true,lightnessControler: true}``` | To hide/unhide controllers
| actionRef | ```ref``` | ```null``` | It expose one method `updateColor` that will update wheel color from external component