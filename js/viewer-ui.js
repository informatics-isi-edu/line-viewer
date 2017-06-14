//
// line-viewer
//
// A flag to track whether plotly viewer is
// being used inside another window (i.e. Chaise), set enableEmbedded.

var enableEmbedded = false;
if (window.self !== window.top) {
  var $iframe_parent_div = window.frameElement ? $(window.frameElement.parentNode) : null;
  if (!$iframe_parent_div || !$iframe_parent_div.is(':visible')) enableEmbedded = true;
}

var trackingPlot=[];
var specialPlotIdx=99;
var specialPnameEye='99_plot_eye_name';
var trackingSpecial=false;

function moreThanOnePlot(){
  if(trackingPlot.length > 1)
    return true;
  return false;
}


function isEmpty(obj) {
  for (var x in obj) {
    if (obj.hasOwnProperty(x))
      return false;
  }
  return true;
}


function getPlotVisName(plot_idx) {
  var _visible_name=plot_idx+"_plot_visible";
  return _visible_name;
}

function getPlotEyeName(plot_idx) {
  var _visible_name=plot_idx+"_plot_eye_name";
  return _visible_name;
}

function setupPlotList(cnt) {
// default to first one
  trackingPlot.push(true);
  for(var i=1;i<cnt;i++) {
    trackingPlot.push(false);
  }
}

// glyphicon-eye-close = glyphicon-one-fine-empty-dot
// glyphicon-eye-open = glyphicon-one-fine-full-dot
// 
function togglePlot(plot_idx, pname_eye) {
  var tmp='#'+pname_eye;
  var eptr = $(tmp);
  if( eptr.hasClass('glyphicon-one-fine-full-dot')) {
    eptr.removeClass('glyphicon-one-fine-full-dot').addClass('glyphicon-one-fine-empty-dot');
    eptr.title='to show';
    if(plot_idx != specialPlotIdx) trackingPlot[plot_idx]= false;
    } else {
      eptr.removeClass('glyphicon-one-fine-empty-dot').addClass('glyphicon-one-fine-full-dot');
      if(plot_idx != specialPlotIdx) trackingPlot[plot_idx]= true;
      eptr.title='';
  }
}

// only click to enable, 
// togglePlot(1,'1_plot_eye_name')
// 1_plot_visible
function toggleToPlot(plot_idx, pname_eye) {
  if(plot_idx == specialPlotIdx) {
    if(trackingSpecial) return; // do nothing
    trackingSpecial=true;
    var cnt=trackingPlot.length;
    var t=[];
    for(var i=0;i<cnt;i++) {
      if(trackingPlot[i]== true) {
        togglePlot(i, getPlotEyeName(i)); // turn found one off 
        togglePlot(plot_idx,pname_eye); // turn clicked one on
      }
      t.push(i);
    }
    refreshPlot(t);
    return;
  }

  if(trackingPlot[plot_idx]== true) {
   // do nothing
    return;
  }

  if(trackingSpecial==true) {
    trackingSpecial = false;
    togglePlot(specialPlotIdx, specialPnameEye); // turn found one off 
    togglePlot(plot_idx,pname_eye); // turn clicked one on
    refreshPlot([plot_idx]);
    return;
  }

  var cnt=trackingPlot.length;
  for(var i=0;i<cnt;i++) {
    if(trackingPlot[i]== true) {
      togglePlot(i, getPlotEyeName(i)); // turn found one off 
      togglePlot(plot_idx,pname_eye); // turn clicked one on
      refreshPlot([plot_idx]);
      return;
    }
  }
}

// fill in the top level of plotList
function add2PlotList(titlelist) {
  for(var i=0; i<titlelist.length;i++) {
    var pname=titlelist[i];
    addOnePlot(i, pname);
  }
  if(moreThanOnePlot()) {
    addOnePlot(specialPlotIdx,'ALL'); // very hacky
  }
  togglePlot(0, getPlotEyeName(0));
}

// given a plot, expand the html structure
function addOnePlot(plot_idx, pname) {
  var name = pname.replace(/ +/g, "");
  var _n=name;
  var _visible_name=plot_idx+"_plot_visible";
  var _collapse_name=plot_idx+"_plot_collapse";
  var _eye_name=plot_idx+"_plot_eye_name";
  var _body_name=plot_idx+"_plot_body";

   var _nn='';
  _nn+='<div class="panel panel-default col-md-12">';
  _nn+='<div class="panel-heading">';
  _nn+='<div class="panel-title row" style="background-color:transparent;">'; 

  if(moreThanOnePlot()) {
    _nn+='<button id="'+_visible_name+'" class="pull-left"  style="display:inline-block;outline: none;border:none; background-color:white"  onClick="toggleToPlot('+plot_idx+',\''+_eye_name+'\')" title="to show"><span id="'+_eye_name+'" class="glyphicon glyphicon-one-fine-empty-dot" style="color:#337ab7;"></span> </button>';
  }

  _nn+='<text>'+pname+'</text>';
  _nn+='</div> <!-- panel-title -->'; 
  _nn+='</div> <!-- panel-heading-->';
  _nn+='<div id="'+_collapse_name+'" class="panel-collapse collapse">';
  _nn+='<div id="'+_body_name+'" class="panel-body">';
  _nn+='</div> <!-- panel-body -->';
  _nn+='</div>';
  // last bits
  _nn+='</div> <!-- panel -->';
  jQuery('#plotList').append(_nn);
//  window.console.log(_nn);
  return _visible_name;
}



