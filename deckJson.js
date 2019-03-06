var bundle = (function (exports, core, d3Dsv) {
  'use strict';

  // TODO - can we reuse the core util? Assuming we don't want to export it

  /* eslint-disable complexity */

  // Compares two objects to see if their keys are shallowly equal
  function shallowEqualObjects(a, b) {
    if (a === b) {
      return true;
    }

    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
      return false;
    }

    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    for (const key in a) {
      if (!(key in b) || a[key] !== b[key]) {
        return false;
      }
    }
    for (const key in b) {
      if (!(key in a)) {
        return false;
      }
    }
    return true;
  }

  // Accept JSON strings by parsing them
  // Returns a fresh object that can be modified.
  // TODO - use a parser that provides meaninful error messages
  function parseJSON(json) {
    return typeof json === 'string' ? JSON.parse(json) : Object.assign({}, json);
  }

  const defaultProps = {
    configuration: []
  };

  class JSONLayer extends core.CompositeLayer {
    initializeState() {
      this.state = {
        layers: []
      };
    }

    updateState({props, oldProps}) {
      const layersChanged =
        props.data !== oldProps.data || props.configuration !== oldProps.configuration;

      if (layersChanged) {
        // Optionally accept JSON strings by parsing them
        const data = typeof props.data === 'string' ? JSON.parse(props.data) : props.data;
        this.state.layers = getJSONLayers(data, props.configuration);
      }
    }

    renderLayers() {
      return this.state.layers;
    }
  }

  JSONLayer.layerName = 'JSONLayer';
  JSONLayer.defaultProps = defaultProps;

  // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in
  // all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  // THE SOFTWARE.

  /**
   * Access properties of nested containers using dot-path notation
   * Returns `undefined` if any container is not valid, instead of throwing
   * @param {Object} container - container that supports get
   * @param {String|*} compositeKey - key to access, can be '.'-separated string
   * @return {*} - value in the final key of the nested container, or `undefined`
   */
  function get(container, compositeKey) {
    // Split the key into subkeys
    const keyList = getKeys(compositeKey);
    // Recursively get the value of each key;
    let value = container;
    for (const key of keyList) {
      // If any intermediate subfield is not an object, return undefined
      value = isObject(value) ? value[key] : undefined;
    }
    return value;
  }

  /**
   * Checks if argument is an "indexable" object (not a primitive value, nor null)
   * @param {*} value - JavaScript value to be tested
   * @return {Boolean} - true if argument is a JavaScript object
   */
  function isObject(value) {
    return value !== null && typeof value === 'object';
  }

  // Cache key to key arrays for speed
  const keyMap = {};

  // Takes a string of '.' separated keys and returns an array of keys
  // - 'feature.geometry.type' => ['feature', 'geometry', 'type']
  // - 'feature' => ['feature']
  function getKeys(compositeKey) {
    if (typeof compositeKey === 'string') {
      // else assume string and split around dots
      let keyList = keyMap[compositeKey];
      if (!keyList) {
        keyList = compositeKey.split('.');
        keyMap[compositeKey] = keyList;
      }
      return keyList;
    }
    // Wrap in array if needed
    return Array.isArray(compositeKey) ? compositeKey : [compositeKey];
  }

  // Converts a JSON payload to a deck.gl props object

  // Support all `@deck.gl/core` Views by default
  const DEFAULT_VIEW_CATALOG = {MapView: core.MapView, FirstPersonView: core.FirstPersonView, OrbitView: core.OrbitView, OrthographicView: core.OrthographicView};

  const DEFAULT_MAP_PROPS = {
    style: 'mapbox://styles/mapbox/light-v9'
  };

  // Converts JSON to props ("hydrating" classes, resolving enums and functions etc).
  function convertTopLevelJSON(json, configuration) {
    // TODO - Currently converts "in place", might be clearer to convert to separate structure
    const jsonProps = json;

    // Convert "JSON layers" in `json.layers` into class instances
    if (jsonProps.layers) {
      jsonProps.layers = convertJSONLayers(json.layers, configuration);
    }

    // Convert "JSON views" in `json.views` into class instances
    if (jsonProps.views) {
      jsonProps.views = convertJSONViews(json.views, configuration);
    }

    if ('initialViewState' in jsonProps) {
      jsonProps.viewState = jsonProps.viewState || jsonProps.initialViewState;
    }

    convertJSONMapProps(jsonProps, configuration);

    return jsonProps;
  }

  // Normalizes map/mapStyle etc props to a `map: {style}` object-valued prop
  function convertJSONMapProps(jsonProps, configuration) {
    if (jsonProps.map || jsonProps.mapStyle) {
      jsonProps.map = Object.assign({}, DEFAULT_MAP_PROPS, jsonProps.map);
    }

    if (!jsonProps.map) {
      return;
    }

    if ('mapStyle' in jsonProps) {
      jsonProps.map.style = jsonProps.mapStyle;
      jsonProps.map.mapStyle = jsonProps.mapStyle;
      delete jsonProps.mapStyle;
    }

    // TODO - better map handling
    if ('viewState' in jsonProps) {
      jsonProps.map.viewState = jsonProps.viewState;
    }
  }

  // Use the composite JSONLayer to render any JSON layers
  function convertJSONLayers(jsonLayers, configuration) {
    return [
      new JSONLayer({
        data: jsonLayers,
        configuration
      })
    ];
  }

  // Instantiates views: `{type: MapView, ...props}` to `MapView(...props)`
  function convertJSONViews(jsonViews, configuration) {
    if (!jsonViews) {
      return jsonViews;
    }

    const viewCatalog = configuration.views || {};

    jsonViews = Array.isArray(jsonViews) ? jsonViews : [jsonViews];
    return jsonViews
      .map(jsonView => {
        // Try to find a view definition
        const View = viewCatalog[jsonView.type] || DEFAULT_VIEW_CATALOG[jsonView.type];
        // Instantiate it
        if (View) {
          const viewProps = Object.assign({}, jsonView);
          delete viewProps.type;
          return new View(viewProps);
        }
        return null;
      })
      .filter(Boolean);
  }

  // LAYERS

  // Replaces accessor props
  function getJSONLayers(jsonLayers = [], configuration) {
    // assert(Array.isArray(jsonLayers));
    const layerCatalog = configuration.layers || {};
    return jsonLayers.map(jsonLayer => {
      const Layer = layerCatalog[jsonLayer.type];
      const props = getJSONLayerProps(jsonLayer, configuration);
      props.fetch = enhancedFetch;
      return Layer && new Layer(props);
    });
  }

  function getJSONLayerProps(jsonProps, configuration) {
    const replacedProps = {};
    for (const propName in jsonProps) {
      // eslint-disable-line guard-for-in
      const propValue = jsonProps[propName];
      // Handle accessors
      if (propName.startsWith('get')) {
        replacedProps[propName] = getJSONAccessor(propValue, configuration);
      } else {
        replacedProps[propName] = propValue;
      }
    }
    return replacedProps;
  }

  // Calculates an accessor function from a JSON string
  // '-' : x => x
  // 'a.b.c': x => x.a.b.c
  function getJSONAccessor(propValue, configuration) {
    if (propValue === '-') {
      return object => object;
    }
    if (typeof propValue === 'string') {
      return object => {
        return get(object, propValue);
      };
    }
    return propValue;
  }

  // HELPERS

  function enhancedFetch(url) {
    /* global fetch */
    return fetch(url)
      .then(response => response.text())
      .then(text => {
        try {
          return JSON.parse(text);
        } catch (error) {
          const csv = d3Dsv.csvParseRows(text);
          return csv;
        }
      });
  }

  // Converts JSON to props ("hydrating" classes, resolving enums and functions etc).

  class JSONConverter {
    constructor(props) {
      this.configuration = {};
      this.onJSONChange = () => {};
      // this._onViewStateChange = this._onViewStateChange.bind(this);
      this.setProps(props);
    }

    finalize() {}

    setProps(props) {
      // HANDLE CONFIGURATION PROPS
      if ('configuration' in props) {
        this.configuration = props.configuration;
      }

      if ('onJSONChange' in props) {
        this.onJSONChange = props.onJSONChange;
      }
    }

    convertJsonToDeckProps(json) {
      // Use shallow equality to Ensure we only convert once
      if (!json || json === this.json) {
        return this.deckProps;
      }
      this.json = json;

      // Accept JSON strings by parsing them
      const parsedJSON = parseJSON(json);

      // Convert the JSON
      const jsonProps = convertTopLevelJSON(parsedJSON, this.configuration);

      // Handle `json.initialViewState`
      // If we receive new JSON we need to decide if we should update current view state
      // Current heuristic is to compare with last `initialViewState` and only update if changed
      if ('initialViewState' in jsonProps) {
        const updateViewState =
          !this.initialViewState ||
          !shallowEqualObjects(jsonProps.initialViewState, this.initialViewState);

        if (updateViewState) {
          jsonProps.viewState = jsonProps.initialViewState;
          this.initialViewState = jsonProps.initialViewState;
        }

        delete jsonProps.initialViewState;
      }

      this.deckProps = jsonProps;
      return jsonProps;
    }
  }

  //

  exports._JSONConverter = JSONConverter;
  exports._JSONLayer = JSONLayer;

  return exports;

}({}, deck, d3Dsv));
