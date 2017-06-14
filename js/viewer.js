//
// line-viewer
//
// Usage example:
//  http://localhost/gpcr/other_viewer/view.html?
//     http://localhost/data/gpcr/dummy.csv
//
//  http://localhost/gpcr/other_viewer/view.html?
//     url=http://localhost/data/other_viewer/data-dummy.csv
//
//  see viewer-line.js for more examples
//

var  initPlot_data=[]; // very first set of original data
var  initPlot_label=[]; // very first set of original data's label
var  initPlot_name=[]; // original file stubs of the data file

var  lineDivname="#myViewer_line";
var  frameWidth=0;
var  frameHeight=0;

var  saveFirst=true;

/* default set of color if user did not supply any
#DF0F0F    red (0.847, 0.057, 0.057)
#868600    yellow (0.527, 0.527, 0)
#009600    green (0, 0.592, 0)
#008E8E    cyan (0, 0.559, 0.559)
#5050FC    blue (0.316, 0.316, 0.991)
#B700B7    magenta (0.718, 0, 0.718)
*/

var defaultColor=['#DF0F0F','#868600','#009600','#5050FC', '#B700B7','#008E8E'];
// in case myColor is too few
// just cycle through
function getDefaultColor(p) {
  var len=defaultColor.length;
  var t= (p+len) % len; 
  return defaultColor[t];
}

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
 // okay
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
};

/*****MAIN*****/
jQuery(document).ready(function() {

//window.console.log("in Ready call..");

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

// if the framewidth is small, then make the pull out to span
// the whole width or else just partial
  var ctrlptr=$('#controlBlock');
  if(frameWidth < 300) {
       ctrlptr.addClass("col-xs-12");
  } else if (frameWidth < 600) {
       ctrlptr.addClass("col-xs-6");
  } else {
       ctrlptr.addClass("col-xs-4");
  }

  var fstub='csv';

  // defaults from viewer-user.js
//http://localhost/synapse/view.html?http://localhost/data/synapse/segments-dummy.csv
  var args=document.location.href.split('?');
//window.console.log("ARGS",document.location.href);
  if (args.length >= 2) {
     var urls=processArgs(args);
     if(urls.length >= 1) {
       initPlot_name=loadAndProcessCSVfromFile(urls);
       if(initPlot_name == [])
         return;
       setupPlotList(initPlot_name.length);
       add2PlotList(initPlot_name);
       } else {
         alertify.error("Usage: view.html?http://datapath/data.csv");
         return;
     }
     } else {
       alertify.error("Usage: view.html?http://datapath/data.csv");
       return;
  }

  if(!enableEmbedded) {
    displayInitPlot();
  }

// under chaise/angular, the plot window has
// width/height=0 when accordian-group is-open=false

  var resizeTimer;
  window.addEventListener('resize', function(event){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      doResize();
    }, 250);
  });

}) // end of MAIN

function doResize() {
  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;
//window.console.log("ONSIZE:: ", frameWidth, ", ",frameHeight);
  if(enableEmbedded) {
    if(saveFirst) {
      displayInitPlot();
       saveFirst=false;
      return;
    }
  }
  resizePlots();
}

// initial plot to display, always the first one
function displayInitPlot() {
  var plot_idx=0;
  refreshPlot([plot_idx]);
}

// could replace with code that does
// restyle if the respond time is too 
// slow
function resizePlots() {
  var plot_idx=0;
  refreshPlot([plot_idx]);
}

// This completely recompute the plot
// with one or more url plot data
function refreshPlot(plot_idx_list) {
  $(lineDivname).empty();
  var pcnt=plot_idx_list.length;
  var configs=[];
  for(var i=0; i<pcnt; i++) {
    configs.push(getPlotData(plot_idx_list[i])); 
           //[pdata,xidx, yidx, clist,alist];
  }
  addLinePlot(lineDivname, configs, frameWidth-5, frameHeight-5);
}

