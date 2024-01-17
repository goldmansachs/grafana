//# sourceURL=embed.js
// The marker above helps Google Chrome to find the source code in Developer Console (https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Debug_eval_sources)
// accessable variables in this scope
var window, document, ARGS, $, jQuery, moment, kbn, _, services;

var constructDashboardAsync = function (callbackFunction) {

  if (!ARGS) {
    ARGS = {};
  }

  var downsampleIntTemplate = {
    "type": "interval",
    "datasource": null,
    "hide": 2,
    "refresh_on_load": false,
    "name": "downsampleInt",
    "options": [
      {
        "text": "auto",
        "value": "$__auto_interval"
      },
      {
        "text": "1m",
        "value": "1m"
      },
      {
        "text": "10m",
        "value": "10m"
      },
      {
        "text": "30m",
        "value": "30m"
      },
      {
        "text": "1h",
        "value": "1h"
      },
      {
        "text": "6h",
        "value": "6h"
      },
      {
        "text": "12h",
        "value": "12h"
      },
      {
        "text": "1d",
        "value": "1d"
      },
      {
        "text": "7d",
        "value": "7d"
      },
      {
        "text": "14d",
        "value": "14d"
      },
      {
        "text": "30d",
        "value": "30d"
      }
    ],
    "includeAll": false,
    "allFormat": "glob",
    "query": "1m,10m,30m,1h,6h,12h,1d,7d,14d,30d",
    "auto": true,
    "current": {
      "text": "1m",
      "value": "1m"
    },
    "auto_count": 200
  };

  function loadDashboard() {
    var result = {
      "title": "Metrics Overview",
      "time": {
        "from": "now-1h",
        "to": "now"
      },
      "rows": [
        {
          "title": "",
          "height": "600px",
          "editable": false,
          "collapse": false,
          "showTitle": false,
          "panels": [
            {
              "id": 0,
              "span": 12,
              "editable": false,
              "type": "graph",
              "renderer": "flot",
              "x-axis": true,
              "y-axis": true,
              "scale": 1,
              "y_formats": [
                "gscustom",
                "none"
              ],
              "lines": true,
              "fill": 0,
              "linewidth": 2,
              "points": false,
              "pointradius": 5,
              "bars": false,
              "stack": false,
              "percentage": false,
              "legend": {
                "show": true,
                "values": true,
                "min": false,
                "max": false,
                "current": false,
                "total": false,
                "avg": false,
                "hideEmpty": false,
                "alignAsTable": false,
                "rightSide": false
              },
              "nullPointMode": "connected",
              "steppedLine": false,
              "tooltip": {
                "value_type": "cumulative",
                "shared": false
              },
              "seriesOverrides": [],
              "links": [],
              "leftYAxisLabel": "",
              "targets": [],
              "title": ""
            }
          ]
        }
      ],
      "templating": {
        "list": [ ],
        "enable": true
      }
    };

    // Auto-downsampling template
    result.templating.list.push(downsampleIntTemplate);

    // construct target from ARGS
    setTimeRange(result);

    if (result.rows[0] && ARGS.height) {
      result.rows[0].height = ARGS.height;
    }

    var panel = result.rows[0].panels[0];
    customizePanel(panel)
    
    if (ARGS.targets) {
      // Example usage : http://grafana-url.com/#/dashboard/script/embed.js?targets=%5B%7B%22domain%22:%22system%22,%22asset%22:%22nds1630358.com%22,%22metric%22:%22ENDPOINT.Processor.PercentUserTime%22%7D%5D&startTime=now-6h&endTime=now&chartTitle=CPU%20Usage&embed&fullscreen&panelId=1
      // Show multiple lines via target arguments
      var targets = JSON.parse(ARGS.targets);
      for (var i=0; i<targets.length; ++i) {
        var defaultTarget = newTarget();
        var originalTarget = targets[i];
        var target = Object.assign(defaultTarget, undefined, originalTarget);
        if (target.domain && target.asset && target.metric) {
          enrichAliasIfMissing(target);
          addTarget(target, panel);
        } else {
          console.log("Invalid target: domain, asset or metric is empty", target);
        }
      }
    } else {
      var target = newTarget();
      setTargetProperties(target);
      addTarget(target, panel);
    }
    callbackFunction(result);
  }

  function enrichAliasIfMissing(target) {
    if (! target.alias) {
      // Create simple alias if it's not specified. E.g., vmhost-123.com:UNIX.CPU.pct_used{"disk":"/local"}
      target.alias = target.asset + ':' + target.metric;
      if (! _.isEmpty(target.tags)) {
        target.alias += JSON.stringify(target.tags);
      }
    }
  }

  function setTargetProperties(target) {
    if (ARGS.aggregator) {
      target.aggregator = ARGS.aggregator;
    }

    if (ARGS.downsampleagg) {
      target.downsampleAggregator = ARGS.downsampleagg;
      target.shouldDownsample = true;
    }

    if (ARGS.downsampleInterval && ARGS.downsamplePeriod) {
      target.downsampleInterval = ARGS.downsampleInterval + ARGS.downsamplePeriod;
      target.shouldDownsample = true;
    }

    if (ARGS.isRate == true) {
      target.shouldComputeRate = true;
    }

    if (ARGS.asset) {
      target.asset = ARGS.asset;
    }

    if (ARGS.metric) {
      target.alias = ARGS.metric;
      target.metric = ARGS.metric;
    }

    if (ARGS.domain) {
      target.domain = ARGS.domain;
    }

    if (ARGS.tags) {
      target.tags = JSON.parse(decodeURI(ARGS.tags));
    }

    if (ARGS.formula) {
      target.isFormula = true;
      target.formula = ARGS.formula;
    }
  }

  function newTarget() {
    return {
      "errors": {},
      "aggregator": "avg",
      "downsampleAggregator": "avg",
      "asset": "",
      "metric": "",
      "shouldDownsample": true,
      "downsampleInterval": "$downsampleInt",
      "tags": {},
      "alias": ""
    }
  }

  function addTarget(target, panel) {
    panel.targets.push(target);
  }

  function setTimeRange(dashboard) {
    if (ARGS.startTime) {
      dashboard.time.from = ARGS.startTime;
    }

    if (ARGS.endTime) {
      dashboard.time.to = ARGS.endTime;
    }
  }

  function customizePanel(panel) {
    if (!_.isUndefined(ARGS.metricCategory)) {
      panel.title = ARGS.metricCategory + " " + ARGS.metric;
    } else if (!_.isUndefined(ARGS.chartTitle)) {
      panel.title = ARGS.chartTitle;
    } else {
      panel.title = ARGS.asset + " - " + ARGS.metric;
    }
  }

  loadDashboard();
};

return constructDashboardAsync;
