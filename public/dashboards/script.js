//# sourceURL=script.js
// The marker above helps Google Chrome to find the source code in Developer Console (https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Debug_eval_sources)
// accessable variables in this scope

var window, document, ARGS, $, jQuery, moment, kbn, _, services;

var sysdigService = function($) {
  var uniquePanelId = 0;
  var backendId = ARGS['backend'];
  var backend = "default";

  if (backendId.match("prod[2-9]$")) {
    backend = "Sysdig Prod" + backendId.at(4);
  } else if (backendId == "prod1") {
    backend = "Sysdig Prod";
  }
  var createDefaultSysdigTarget = function(custom) {
    var target = {
      "datasource": backend,
      "groupAggregation": "avg",
      "isTabularFormat": false,
      "pageLimit": "10",
      "segmentBy": [],
      "timeAggregation": "timeAvg"
    };
    _(["filter", "target"]).forEach(function(requiredField) {
      if (! custom.hasOwnProperty(requiredField)) {
        console.log("Following argument to createDefaultSysdigTarget is missing required field", custom);
        throw new Error("createDefaultTarget takes an object with field "+ requiredField);
      }
    });
    $.extend(target, custom);
    return target;
  };

  var createDefaultSysdigPanel = function(custom) {
    var panel = {
      "id": uniquePanelId++,
      "aliasColors": {},
      "datasource": backend,
      "fill": 1,
      "fillGradient": 0,
      "span": 6,
      "hiddenSeries": false,
      "legend": {
        "alignAsTable": false,
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "options": {
        "dataLinks": []
      },
      "percentage": false,
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": true,
      "steppedLine": false,
      "targets": [],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Default Panel",
      "tooltip": {},
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "percent",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": "0",
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    };
    $.extend(panel, custom);
    return panel;
  };

  var createDefaultSysdigRow = function(custom) {
    var row = {
      "title": "Default",
      "height": "300px",
      "editable": true,
      "collapse": true,
      "showTitle": true,
      "panels": []
    };
    $.extend(row, custom);
    return row;
  };

  return {
    createDefaultSysdigPanel: createDefaultSysdigPanel,
    createDefaultSysdigRow: createDefaultSysdigRow,
    createDefaultSysdigTarget: createDefaultSysdigTarget
  };
};

var pulseService = function($) {
  var uniquePanelId = 0;
  var createDefaultTarget = function(custom) {
    var target = {
      "aggregator": "avg",
      "downsampleAggregator": "avg",
      "shouldDownsample": true,
      "downsampleInterval": "5m",
      "tags": {
      },
      "shouldComputeRate": false,
      "isCounter": false
    };

    _(["domain", "asset", "metric"]).forEach(function(requiredField) {
      if (! custom.hasOwnProperty(requiredField)) {
        console.log("Following argument to createDefaultTarget is missing required field", custom);
        throw new Error("createDefaultTarget takes an object with field "+ requiredField);
      }
    });
    $.extend(target, custom);
    return target;
  };

  var createDefaultPanel = function(custom) {
    var panel = {
      // Each panel requires unique ID in Grafana
      "id": uniquePanelId++,
      "title": "Default Panel",
      "span": 6,
      "type": "graph",
      "x-axis": true,
      "y-axis": true,
      "scale": 1,
      "y_formats": [
        "percent",
        "none"
      ],
      "grid": {
        "max": null,
        "min": null,
        "leftMax": 100,
        "rightMax": null,
        "leftMin": 0,
        "rightMin": null,
        "threshold1": null,
        "threshold2": null,
        "threshold1Color": "rgba(216, 200, 27, 0.27)",
        "threshold2Color": "rgba(234, 112, 112, 0.22)",
        "thresholdLine": false
      },
      "resolution": 100,
      "lines": true,
      "fill": 0,
      "linewidth": 2,
      "points": false,
      "pointradius": 5,
      "bars": false,
      "stack": false,
      "spyable": true,
      "options": false,
      "legend": {
        "show": true,
        "values": true,
        "min": false,
        "max": false,
        "current": true,
        "total": false,
        "avg": true,
        "hideEmpty": false,
        "alignAsTable": true
      },
      "interactive": true,
      "legend_counts": true,
      "timezone": "browser",
      "percentage": false,
      "nullPointMode": "null as zero",
      "steppedLine": false,
      "tooltip": {
        "value_type": "individual",
        "query_as_alias": true,
        "shared": false
      },
      "targets": [],
      "renderer": "flot",
      "annotate": {
        "enable": false
      },
      "seriesOverrides": [],
      "leftYAxisLabel": "sample label",
      "links": []
    };
    $.extend(panel, custom);
    return panel;
  };

  var createHtmlPanel = function(custom) {
    var panel = {
      id: uniquePanelId++,
      span: 12,
      type: "text",
      mode: "html",
      style: {},
      links: [],
      title: "Default HTML panel",
      content: "<p><a href='pulse.gs.com'>Pulse</a> default HTML panel</p>"
    };
    $.extend(panel, custom);
    return panel;
  };

  var createDefaultRow = function(custom) {
    var row = {
      "title": "Default",
      "height": "300px",
      "editable": true,
      "collapse": true,
      "showTitle": true,
      "panels": []
    };
    $.extend(row, custom);
    return row;
  };

  return {
    createDefaultPanel: createDefaultPanel,
    createHtmlPanel: createHtmlPanel,
    createDefaultRow: createDefaultRow,
    createDefaultTarget: createDefaultTarget
  };
};

var constructDashboardAsync = function (callbackFunction) {
  // Example value: "user/dashboardHost"
  var dashboardId = ARGS['dashboard'];

  // https://grafana-url.com/api/datasources/proxy/1/grafana/script/user/dashboardHost
  var url = '/api/datasources/proxy/1/grafana/script/'+dashboardId;
  $.ajax({
    method: 'GET',
    url: url
  }).done(function(scriptedDashboardApiResult) {
    executeScriptedDashboard(scriptedDashboardApiResult, callbackFunction);
  });
};

var executeScriptedDashboard = function(scriptedDashboardApiResult, callbackFunction) {
  // The result is from GrafanaController.getScriptedDashboard
  if (! scriptedDashboardApiResult) {
      console.log("Scripted dashboard returned empty for URL" + url);
      return;
  }
  environmentConfig = {
      pulseApiBaseUrl: '/api/datasources/proxy/1'
  };
  var scriptBody = scriptedDashboardApiResult.script;
  var scriptFunc = new Function('ARGS', 'kbn', '_', 'moment', 'window', 'document', '$', 'jQuery', 'services', scriptBody);
  var servicesForFunc = {
    pulseService: pulseService($),
    sysdigService: sysdigService($)
  };
  var scriptResult = scriptFunc(ARGS, kbn, _, moment, window, document, $, $, servicesForFunc);

  // Handle async dashboard scripts
  var dashboardPromise;
  if (_.isFunction(scriptResult)) {
    try {
      dashboardPromise = new Promise(resolve => {
        scriptResult(function (dashboard) {
          resolve({data: dashboard});
        });
      });
    } catch (e) {
      console.log('Caught an error', e);
    }
    //dashboardPromise = promise;
  } else {
    dashboardPromise = Promise.resolve({ data: scriptResult });
  }
  dashboardPromise.then(function(scriptedDashboardResult) {
      handleScriptedDashboardResult(scriptedDashboardResult, callbackFunction);
    },
    function(err) {
        console.log("Failed to resolve promise", err);
    });
};

var handleScriptedDashboardResult = function (scriptedDashboardResult, callbackFunction) {
  var dashboardObj = scriptedDashboardResult.data;
  // This API converts Grafana1 dashboard to Grafana5
  var dashboardConvertUrl = '/api/datasources/proxy/1/grafana/dashboards/convert';
  if (dashboardObj.panels) {
    // In case the function already returns Grafana 5 Dashboard object, then
    // we don't need to call
    callbackFunction(dashboardObj);
  } else {
    $.ajax({
      method: 'POST',
      url: dashboardConvertUrl,
      data: JSON.stringify(dashboardObj),
      contentType: 'application/json'
    }).done(function(convertedDashboard) {
      callbackFunction(convertedDashboard);
    }).fail(function(jqXHR, textStatus){
      console.log("Failed to call convert API", textStatus, jqXHR);
    });
  }
};

return constructDashboardAsync;
