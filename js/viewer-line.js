//
// line-viewer
//
// This is very dataset specific information
// for, USC
//
// allow for multiple files input with same csv format
// and then a set of parameter to designate x and multiple y
// optionally alias name per y, color per y, 
// also optionally check for skipping lines
// every url has a set of above settable parameters

// these are per data file
var initXidx=[];  // column idx to be used for x axis
var initYidx=[];  // column idx to be used for data lines
var initAlias=[]; // alias for each header lines to be used as label
var initMarker=[];// 'markers', 'lines', 'lines+markers'
var initColor=[]; // color of the marker
var initSkip=[];  // how many lines to skip after the header (1st row)
var initXAxis=[]; // label for x axis
var initYAxis=[]; // label for y axis
var initTitle=[]; // title for the plot,
var initLabel=[]; // label for the datafile
var initXY=[];    // for picking x, y index, and pairing
var initTrace=[]; // for storing trace property
var initHeader=[]; // true/false to show if csv file has a row of header
                   // or not, if false, then header label needs to be
                   // supplement with index of column
var myColor=[];   // color to be used - merged from initColor&defaultColor

// http://localhost/synapse/view.html?
//     url=http://localhost/data/synapse/segments-dummy.csv


// per url, first-in first-out
// 
// xylayout = (chars) xy index mode: 'shareX', 'interleave' or
//         [ {"x":0,"y":1},{"x":2,"y":3}..]
//     x = (integer) csv column idx
//     y = (integer) csv column idx
// trace = [ { "id":0,"name":"firstTrace","color":"blue","marker":"lines+markers"},
//           { "headerY":"column-header","name":"thirdTrace"}]
//           { "id":3,"name":"fourthTrace","marker":"lines"}] **
//     alias = (chars) trace name , default(column name)
//     color = (chars) trace color  
//     marker = (chars) 'markers'(default), 'lines', or 'lines+markers'
//
// plot = [ { "xaxis":"temperature", "yaxis":"Y",
//            "skiprow":1, "name":"firstFile",
//            "header":true } ]
//     xaxis = (chars) xaxis label
//     yaxis = (chars) yaxis label
//     aliaslabel = (chars) label for datafile, default(file stub)
//
//     header = true or false, to handle bare csv file
//     skiprow = (integer) number of lines to skip after the first row of header
// 
// ** using trace to define th trace characteristics is limited in
//    several ways, it assumes, y column can only be used once and only
//    once in a plot and header column name must be unique within the plot.
//    Ideally the number of traces should corresponds with the (x,y) pairing
//    but not necessarily


function processArgs(args) {
  var trackidx=null;  // tracking trace idx
  var hasidx=false;   // backward compatiable when there is no idx setting
  var urls=[];
  var xidx=[];
  var yidx=[];
  var alias=[];
  var color=[];
  var skip=0;
  var xaxis=[];
  var yaxis=[];
  var xy=null;
  var trace=null;
  var title=null;
  var header=true;
  var label=null;
  var marker=[];;
  var first=true;
//window.console.log(args[1]);
  var params = args[1].split('&');
  for (var i=0; i < params.length; i++) {
    var param = unescape(params[i]);
    if (param.indexOf('=') == -1) {
      var tmp=param.replace(new RegExp('/$'),'').trim();
      urls.push(tmp);
      } else {
        var kvp = param.split('=');

var myProcessArg=function(kvp0, kvp1) {
        switch (kvp0.trim()) {
          case 'idx': // indexing into trace list
            {
            var t=parseInt(kvp1);
            if(!isNaN(t))
               traceidx=t;
            break;
            }
          case 'url':
            {
             var tmp=kvp1.replace(new RegExp('/$'),'').trim();
             urls.push(tmp);
//window.console.log("found..",tmp);
             // reset the x-idx and y-idx set
             if(!first) {
               if(xidx.length == 0)
                 xidx.push(0);
               if(yidx.length == 0)
                 yidx.push(1);
// special handling, expand x 
if(yidx.length > xidx.length) {
  var target=xidx[xidx.length-1];
  var cnt=yidx.length-xidx.length;
  for(var k=0; k< cnt;k++) {
    xidx.push(target);
  }
}
               initXidx.push(xidx);
               xidx=[];
               initYidx.push(yidx);
               yidx=[];
               if(xaxis == null)
                 xaxis.push('X');
               initXAxis.push(xaxis);
               xaxis=null;
               if(yaxis == null)
                 yaxis.push('Y');
               initYAxis.push(yaxis);
               yaxis=null;
               initColor.push(color);
               color=[];               
               initAlias.push(alias);
               alias=[];
               initSkip.push(skip);
               skip=0;
               initTitle.push(title);
               title=null;
               initHeader.push(header);
               header=true;
               initLabel.push(label);
               label=null;
               initMarker.push(marker);
               marker=[];
               initXY.push(xy);
               xy=null;
               initTrace.push(trace);
               trace=null;
               first=false;
             }
             first=false;
             break;
             }
          case 'x':
             {
             var t=parseInt(kvp1);
             if(!isNaN(t))
               xidx.push(t);
             break;
             }
          case 'y':
             {
             var t=parseInt(kvp1);
             if(!isNaN(t)) {
               yidx.push(t);
             }
             break;
             }
          case 'alias': 
             {
             var t=trimQ(kvp1);
             alias.push(t);
             break;
             }
          case 'color': 
             {
             var t=trimQ(kvp1);
             color.push(t);
             break;
             }
          case 'xaxis': 
          case 'xaxislabel': 
             {
             var t=trimQ(kvp1);
             xaxis=t;
             break;
             }
          case 'yaxis': 
          case 'yaxislabel': 
             {
             var t=trimQ(kvp1);
             yaxis=t;
             break;
             }
          case 'marker':
             {
             var t=trimQ(kvp1);
             marker.push(t);
             break;
             }
// this is the number of lines to skip for header..
          case 'skiprow': 
             {
             var t=parseInt(kvp1);
             if(!isNaN(t))
               skip=t;
             break;
             }
          case 'title': 
             {
             var t=trimQ(kvp1);
             title=t;
             break;
             }
          case 'header': 
             {
             header=kvp1; 
             break;
             }
          case 'xy': 
          case 'xylayout': 
             {
             var t=trimQ(kvp1);
             xy=t;
             break;
             }
          case 'trace': 
             {
             var t=trimQ(kvp1);
             trace=t;
             break;
             }
          case 'aliasLabel': 
          case 'aliaslabel': 
             {
             var t=trimQ(kvp1);
             label=t;
             break;
             }
          case 'plot': 
             {
// plot = [ { "xaxis":"temperature", "yaxis":"Y",
//            "skiprow":1, "name":"firstFile",
//            "header":true } ]
             var t=trimQ(kvp1);
             var items;
             if( typeof t === 'object') {
               items=t; 
               } else {
                 items = JSON.parse(t);
             }
             for( var pidx in items ) {
                var p=items[pidx]; // for a single plot
                for(var tidx in p ) {
                   var t=p[tidx]; // for a single plot
//window.console.log("plots:", tidx, " ",t);
                   myProcessArg(tidx, t);
                }
             }
             break;
             }
         case "metaurl":
             {
             var furl=trimQ(kvp1);
             var t=ckExist(furl);
             myProcessArg('meta', t);
             break;
             }
         case "meta":
             {
             var t=trimQ(kvp1);
             var items = JSON.parse(t);
             for( var pidx in items ) {
                var p=items[pidx]; // for a single plot
// special case,  if there is no url in here, stuff in a dummy one
                var t=p['url'];
                if(t == undefined) {
                  alertify.error("Fail: must supply an url");
                }
                for(var tidx in p ) {
                   var t=p[tidx]; // for a single plot
//window.console.log("plots:", tidx, " ",t);
                   myProcessArg(tidx, t);
                }
             }
             break;
             }
          default: { 
window.console.log("dropping this...",kvp0.trim());
             /* drop this..*/
             break;
             }
       }
}; // funciton myProcessArg
//window.console.log("kvp ..", kvp[0], " ", kvp[1]);
       myProcessArg(kvp[0], kvp[1]);
    }
  }
  { // last part
    if(xidx.length == 0)
      xidx.push(0);
    if(yidx.length == 0)
      yidx.push(1);
// special case
if(yidx.length > xidx.length) {
  var target=xidx[xidx.length-1];
  var cnt=yidx.length-xidx.length;
  for(var k=0; k<cnt;k++) {
    xidx.push(target);
  }
}
    initXidx.push(xidx);
    initYidx.push(yidx);
    initColor.push(color);
    initAlias.push(alias);
    initSkip.push(skip);
    if(xaxis == null)
      xaxis.push('X');
    initXAxis.push(xaxis);
    if(yaxis == null)
      yaxis.push('Y');
    initYAxis.push(yaxis);
    initTitle.push(title);
    initHeader.push(header);
    initXY.push(xy);
    initTrace.push(trace);
    initLabel.push(label);
    initMarker.push(marker);
  }
  return urls;
}

// pick up the key term of every item in array  
// it looks like there are duplicate keys on the cvs file header
function getOriginalDataByKey(data,key) {
//window.console.log(typeof data);
   var alist=data.map(function(k) { return k[key]; } );
   return alist;
}

function getOriginalDataByIdx(data,idx) {
   var alist=data[idx];
   return alist;
}

function trimQ(s) {
// trim if only if alias is a string

  if( s && typeof s === 'string') { 
    var str=s.trim(); // trim the ' or "
    if( (str[0] == "\"" && str[ str.length-1 ] == "\"")
     || (str[0] == "\'" && str[ str.length-1 ] == "\'"))
    str=str.substr(1,str.length-2);
    return str;
  }
window.console.log("trimming.. type is ",typeof s); 
  return s;
}

// given an array of values, return an array of log values
function logValue(data) {
  var n = data.map(function (v) {
    return (Math.round(Math.log10(v)*10000)/10000);
  });
  return n;
}

// csv
function chopForStub(url){
  var s=url.split('/').pop();
  var ss=s.slice(0, -4);
  return ss;
}

function getMyColor(i) {
  return myColor[i];
}

function loadAndProcessCSVfromFile(urls) {
  var nlist=[];
  var cnt=urls.length;

  for( var urlidx=0; urlidx < cnt; urlidx++ ) {
      var url=urls[urlidx];
      var csv=ckExist(url);
      var hasHeader=initHeader[urlidx];

      var fline=csv.split('\n')[0];
      var hdata=[];
      var max_y_columns=0; // should use this to do sanity check, 
      $.csv.toArray(fline, {}, function(err, data) {
        if(hasHeader) {
          hdata=data; 
          } else {
            for(var j=0;j<data.length;j++) {
              hdata.push(j);
            }
        }
        initPlot_label.push(hdata);
        hdata=data;
        max_y_columns=hdata.length; 
      });

      $.csv.toArrays(csv, {}, function(err, data) {
        if(data.length == 0) {
          alertify.error("Fail: can not access ",url);
          return nlist;
        }
        if(!hasHeader) { // stuff hdata to the front
          data.splice(0,0,hdata); 
        }

        if(initSkip.length>urlidx) {
          var skip=initSkip[urlidx];
          data.splice(0,1);
        }
        initPlot_data.push(data);

// if there is xy mode, then to build initYidx and initXidx
        if( initXY[urlidx] != null) {
          var cnt=initPlot_label[urlidx].length;
          var xidx=[];
          var yidx=[];
          while(true) {
            if(initXY[urlidx]=='shareX') {
              xidx.push(0);
              for(var x=1;x<cnt;x++) {
                yidx.push(x); 
              }
              break;
            }
            if(initXY[urlidx]=='interleave') {
              for(var x=0;x<cnt;x++) {
                xidx.push(x);
                x++;
                yidx.push(x);
              }
              break;
            }
            { // then initXY[urlidx]=[{x:0,y:1},{x:2,y:3}..]
              var tmp=initXY[urlidx];
              // parse only if it is in a string
              var xya;
              if( typeof tmp === 'object') {
                xya=tmp;
                } else {
                  xya = JSON.parse(tmp);
              }
              for(var a=0; a < xya.length; a++) {
                var item=xya[a];
                var xx=item['x'];
                var yy=item['y'];
                xidx.push(xx);
                yidx.push(yy);
              }
              break;
            }
          }
          initXidx[urlidx]=xidx; // replace
          initYidx[urlidx]=yidx; // replace
        }
// if there is trace, then to build marker, color and alias list
// trace = [ { "id":0,"name":"firstTrace",'color':'blue','marker':'lines+markers'},
        { // user is supplying a new set of alias
          var alias=initAlias[urlidx];
          var yidx=initYidx[urlidx];
          if(initTrace[urlidx] != null) {
            var marker=[];
            var color=[];
            var alias=[];
            for(var a=0; a < yidx.length; a++) {
               marker[a]="lines";
               color[a]=getDefaultColor(a);
               alias[a]=null;
            }
            var tmp=initTrace[urlidx];
            var trace;
            if( typeof tmp === 'object') {
              trace=tmp;
              } else {
                trace = JSON.parse(tmp);
            }
            for(var a=0; a < trace.length; a++) {
              var item=trace[a];
              var id=null;
              var klist=Object.keys(item);
              var ii=klist.find(function(m) { return m=='id' });
              var ll=klist.find(function(m) { return m=='label'});
              if ( ii != undefined) {
                  id=parseInt(item['id']);
                  } else {
                    if( ll != undefined) {
                      var id=lookupHeaderYInTrace(urlidx,item['label'],0);
                    } else {
                      alertify.error("Fail: bad trace item");
                    } 
              }
              var _name=item['name'];
              var _color=item['color'];
              var _marker=item['marker'];

              if(_marker) marker[id]=_marker;
              if(_color) color[id]=_color;
              if(_name) alias[id]=_name;
            }
            initMarker[urlidx]=marker;
            initColor[urlidx]=color;
            initAlias[urlidx]=alias;
          }
// fill in matching alias with column header label name 
//                  color with default color
//                  maker as 'lines'
// if there are no user supplied values to them
          for(var j=0; j<yidx.length;j++) {
            if(initAlias[urlidx].length < j || 
                      initAlias[urlidx][j] == null) {
              initAlias[urlidx][j]= getHeaderY(urlidx,yidx[j]);
            }
            if(initColor[urlidx].length < j || 
                      initColor[urlidx][j] == null) {
              initColor[urlidx][j]=getDefaultColor(j);
            }
            if(initMarker[urlidx].length < j || 
                      initMarker[urlidx][j] == null) {
              initMarker[urlidx][j]='lines';
            }
          }
        }
      });

      if(initLabel.length >= urlidx && initLabel[urlidx] != null) {
        nlist.push(initLabel[urlidx]);
        } else { 
          var fstub=chopForStub(url);
          nlist.push(fstub);
      }

  }
  return nlist;
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
}

// something default for now
function getHeaderY(pidx,idx) {
   var list=initPlot_label[pidx];
   return list[idx].trim();
}

// given a label, look up which trace is it being used 
// in the tracelist as part of Y, start is where to start searching
// this is to allow multiple y in the trace pairing
function lookupHeaderYInTrace(pidx,label, start) {
   var yidx=initYidx[pidx];  // list of column idx being used for traces
   var list=initPlot_label[pidx];
   for(var i=start; i<yidx.length;i++) {
      var j=yidx[i];
      var t=list[j].trim();
      if(label == t)
        return i;
   }
   alertify.error("Fail: none-existing trace's Y label -> ",label);
}

// given a label, look up which trace is it being used 
// in the tracelist as part of X, start is where to start searching
// this is to allow multiple x in the trace pairing
function lookupHeaderXInTrace(pidx,label, start) {
   var xidx=initXidx[pidx];  // list of column idx being used for traces
   var list=initPlot_label[pidx];
   for(var i=start; i<xidx.length;i++) {
      var j=xidx[i];
      var t=list[j].trim();
      if(label == t)
        return i;
   }
   alertify.error("Fail: none-existing trace's X label -> ",label);
}

// given a label, look up the column idx that matches
// it. Take care of none-unique column name, use start
// as initial starting index
function lookupHeaderInColumn(pidx,label,start) {
   var list=initPlot_label[pidx];
   for(var i=start; i<list.length;i++) {
      var t=list[i].trim();
      if(label == t)
        return i;
   }
   alertify.error("Fail: none-existing column header label -> ",label);
}

// return datalist and a color list
function getPlotData(pidx) {
   var p=initPlot_data[pidx];
   var yidx=initYidx[pidx];
   var clist=initColor[pidx];
   var alist=initAlias[pidx];
   var xidx=initXidx[pidx];
   var xaxis=initXAxis[pidx];
   var yaxis=initYAxis[pidx];
   var title=initTitle[pidx];
   var mlist=initMarker[pidx];
   var label=initLabel[pidx];

   return [p,xidx, yidx, clist,alist, mlist, xaxis,yaxis,title,label];
}


/**************************************************************************
  sample examples

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    xylayout=[{"x":0,"y":1},{"x":0,"y":2},{"x":0,"y":3},{"x":0,"y":4}]

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    xylayout=[{"x":0,"y":1},{"x":0,"y":2},{"x":0,"y":3},{"x":0,"y":4}]&
    xaxislabel='Temperature'&
    yaxislabel='Y axis'&
    title='Title of the plot'&
    trace=[{"id":0,"name":"firstTrace","color":"purple","marker":"lines+markers"},
        {"label":"5179_PGE2","name":"secondTrace"},
        {"id":3,"name":"fourthTrace","marker":"markers"}]

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    xylayout=[{"x":0,"y":1},{"x":2,"y":3},{"x":4,"y":5},{"x":6,"y":7}]&
    xaxislabel=Temperature&
    yaxis='Y axis'&
    marker='lines'&
    alias='First line'&
    title='Title of the plot'

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    x=0&y=1&x=2&y=3&x=4&y=5&x=6&y=7&
    xaxis='Temperature'&
    yaxis='Y axis'&
    marker=lines&
    alias='First line'&
    title='Title of the plot'

//Heat, 4668_PGE2, 5179_PGE2, 5183_PGE2, 5184_PGE2, 5202_PGE2, 5209_PGE2, 5238_PGE2, 5300_PGE2, 5305_PGE2, 5307_PGE2, noreceptor_PGE2
http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    x=0&y=1&y=2&y=3&y=4&y=5&y=6&y=7&y=8&y=9&y=10&y=11&
    xaxis=Temperature&
    yaxis=Y&
    marker='lines'&
    alias=4668_PGE2&
    alias=5179_PGE2&
    alias=5183_PGE2

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    xaxis=Temperature&
    yaxis='Y axis'&
    marker='markers+lines'&
    alias='First line'&
    title='Title of the plot'&
    aliaslabel=datafile#1&
    xylayout=interleave&
  url=http://localhost/data/lines/data2.csv&
    xaxis=Temperature&
    yaxis=Y&
    marker=lines&
    alias=First&
    alias=Second&
    alias=Third&
    xylayout=shareX

http://localhost/line-viewer/view.html?
  url=http://localhost/data/lines/data.csv&
    x=0&y=1&x=2&y=3&x=4&y=5&x=6&y=7&
    xaxislabel=Temperature&
    yaxislabel='Y axis'&
    marker="markers"&
    marker='markers+lines'&
    alias='First line'&
    title='Title of the plot'&
    aliaslabel='datafile#1'&
  url=http://localhost/data/lines/data2.csv&
    x=0&y=1&y=2&y=3&y=4&y=5&y=6&y=7&y=8&y=9&y=10&y=11&
    xaxislabel='2nd Temperature'&
    yaxislabel=Y&
    marker='lines'&
    alias=First&
    alias=Second&
    alias=Third&
    title='Title2'


http://localhost/line-viewer/view.html?
  metaurl=http://localhost/data/lines/meta.json

metaurl
each file has one or more these parameters
[{ 
"url": "http://localhost/data/synapse/segments-dummy.csv",
"aliaslabel":"firstFile", 
"xaxislabel":"temperature",
"yaxislabel":"Y axis",
"header":true,
"skiprow":1,
"xylayout": "interleave", "shareX" 
      or [ {"x":0,"y":1},{"x":2,"y":3},...]
"trace":  each trace in a file has or more of these parameters
  [{ 
  "id":0,  // or "label":columnname, that will be used to lookup id
  "name":"firstTrace", // alias
  'color':'blue',
  'marker':'lines+markers'
  },...]
},...]


currently..
// xylayout = (chars) xy index mode: 'shareX', 'interleave' or
//         [ {"x":0,"y":1},{"x":2,"y":3}..]
//     x = (integer) csv column idx
//     y = (integer) csv column idx
// trace = [ { "id":0,"name":"firstTrace","color":"blue","marker":"lines+markers"},
//           { "label":"column-header","name":"thirdTrace"}]
//           { "id":3,"name":"fourthTrace","marker":"lines"}] **
// plot = [ { "xaxis":"temperature", "yaxis":"Y",
//            "skiprow":1, "name":"firstFile",
//            "header":true } ]

**************************************************************************/
