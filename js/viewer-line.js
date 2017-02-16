//
// line-viewer
//
// This is very dataset specific information
// for, USC
// allow for multiple files input with same csv format
// and then a set of parameter to designate x and multiple y
// optionally alias name per y, color per y, 
// also optionally check for skipping lines
// every url has a set of above settable parameters

// these are per data file
var initXidx=[];  // column idx to be used for x axis
var initYidx=[];  // column idx to be used for data lines
var initAlias=[]; // alias for each lines to be used as label
var initColor=[]; //initial color supplied by user
var myColor=[];   // color to be used - merged from initColor&defaultColor
var initSkip=[];  // skip how many lines as header
var initXAxis=[];
var initYAxis=[];
var initMarker=[]; 'markers', 'lines', 'lines+markers'
var initTitle=[]; // title for the plot,
var initLabel=[]; // label for the datafile
var initXY=[]; // mode for picking x, y index

// http://localhost/synapse/view.html?
//     url=http://localhost/data/synapse/segments-dummy.csv


// per url, first-in first-out
// 
// x = (integer) csv column idx
// y = (integer) csv column idx
// xy = null, 'oneall', 'crossall'
// alias = (chars) trace name , default(column name)
// color = (chars) trace color  
// xaxis = (chars) xaxis label
// yaxis = (chars) yaxis label
// marker = (chars) 'markers'(default), 'lines', or 'lines+markers'
// skip = (integer) number of lines to skip for the header
// title = (chars) title of the plot
// aliasLabel = (chars) label for datafile, default(file stub)
// xy = (chars) xy index mode
// 
// 



function processArgs(args) {
  var urls=[];
  var xidx=[];
  var yidx=[];
  var alias=[];
  var color=[];
  var skip=0;
  var xy=null;
  var title=null;
  var label=null;
  var marker='lines';
  var first=true;
  var params = args[1].split('&');
  for (var i=0; i < params.length; i++) {
    var param = unescape(params[i]);
    if (param.indexOf('=') == -1) {
      var tmp=param.replace(new RegExp('/$'),'').trim();
      urls.push(tmp);
      } else {
        var kvp = param.split('=');
        switch (kvp[0].trim()) {
          case 'url':
            {
             var tmp=kvp[1].replace(new RegExp('/$'),'').trim();
             urls.push(tmp);
//window.console.log("found..",tmp);
             // reset the x-idx and y-idx set
             if(!first) {
               if(xidx.length == 0)
                 xidx.push(0);
               if(yidx.length == 0)
                 yidx.push(1);
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
               initLabel.push(label);
               label=null;
               initMarker.push(marker);
               marker='lines';
               initXY.push(xy);
               xy=null;
               first=false;
             }
             first=false;
             break;
             }
          case 'x':
             {
             var t=parseInt(kvp[1]);
             if(!isNaN(t))
               xidx.push(t);
             break;
             }
          case 'y':
             {
             var t=parseInt(kvp[1]);
             if(!isNaN(t)) {
               yidx.push(t);
             }
             break;
             }
          case 'alias': 
             {
             var t=trimQ(kvp[1]);
             alias.push(t);
             break;
             }
          case 'color': 
             {
             var t=trimQ(kvp[1]);
             color.push(t);
             break;
             }
          case 'xaxis': 
             {
             var t=trimQ(kvp[1]);
             xaxis=t;
             break;
             }
          case 'yaxis': 
             {
             var t=trimQ(kvp[1]);
             yaxis=t;
             break;
             }
          case 'marker':
             {
             var t=trimQ(kvp[1]);
             marker=t;
             break;
             }
// this is the number of lines to skip for header..
          case 'skip': 
             {
             var t=parseInt(kvp[1]);
             if(!isNaN(t))
               skip=t;
             break;
             }
          case 'title': 
             {
             var t=trimQ(kvp[1]);
             title=t;
             break;
             }
          case 'xy': 
             {
             var t=trimQ(kvp[1]);
             xy=t;
             break;
             }
          case 'aliasLabel': 
             {
             var t=trimQ(kvp[1]);
             label=t;
             break;
             }
          default: { 
window.console.log("dropping this...",kvp[0].trim());
             /* drop this..*/
             break;
             }
       }
    }
  }
  {
    if(xidx.length == 0)
      xidx.push(0);
    if(yidx.length == 0)
      yidx.push(1);
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
    initXY.push(xy);
    initLabel.push(label);
    initMarker.push(marker);
  }
  return urls;
}

// pick up the key term of every item in array  
// it looks like there are duplicate keys on the cvs file header
function getOriginalDataByKey(data,key) {
   var alist=data.map(function(k) { return k[key]; } );
   return alist;
}

function getOriginalDataByIdx(data,idx) {
   var alist=data[idx];
   return alist;
}

function trimQ(alias) {
  var str=alias.trim(); // trim the ' or "
  if( (str[0] == "\"" && str[ str.length-1 ] == "\"")
   || (str[0] == "\'" && str[ str.length-1 ] == "\'"))
  str=str.substr(1,str.length-2);
  return str;
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

  for( var i=0; i < cnt; i++ ) {
      var url=urls[i];
      var csv=ckExist(url);
      var fline=csv.split('\n')[0];
//window.console.log(fline);
// process the first line..
      $.csv.toArray(fline, {}, function(err, data) {
//window.console.log(data);
        initPlot_label.push(data);
      });

      $.csv.toArrays(csv, {}, function(err, data) {
        if(data.length == 0) {
          alertify.error("Fail: can not access ",url);
          return nlist;
        }
        if(initSkip.length>i) {
          var skip=initSkip[i];
          data.splice(0,1);
        }
        initPlot_data.push(data);

// if there is xy mode, then to build initYidx and initXidx
        if( initXY[i] != null) {
          var cnt=initPlot_label[i].length;
          var xidx=[];
          var yidx=[];
          if(initXY[i]=='oneall') {
            xidx.push(0);
            for(var x=1;x<cnt;x++) {
              yidx.push(x); 
            }
          }
          if(initXY[i]=='crossall') {
            for(var x=0;x<cnt;x++) {
              xidx.push(x);
              x++;
              yidx.push(x);
            }
          }
          initXidx[i]=xidx;
          initYidx[i]=yidx;
        }
// fill in matching alias with column label name 
// if there is no user supplied alias to it
        var alias=initAlias[i];
        var yidx=initYidx[i];
// need to fill in some, if alias.length < yidx.length
        for(var j=alias.length; j<yidx.length;j++) {
          initAlias[i][j]= getYLabel(i,yidx[j]);
        }
      });

      if(initLabel.length >= i && initLabel[i] != null) {
        nlist.push(initLabel[i]);
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
function getYLabel(pidx,idx) {
   var list=initPlot_label[pidx];
   return list[idx];
}

// return datalist and a color list
function getPlotData(pidx) {
   var p=initPlot_data[pidx];
   var yidx=initYidx[pidx];
   var color=initColor[pidx];
   var alias=initAlias[pidx];
   var xidx=initXidx[pidx];
   var xaxis=initXAxis[pidx];
   var yaxis=initYAxis[pidx];
   var title=initTitle[pidx];
   var marker=initMarker[pidx];
   var label=initLabel[pidx];

   var clist=[];
   var alist=[];
   var tlist=[];

   var cnt=yidx.length; // number of traces to be used
   for(var i=0;i<cnt; i++) {
     if(color.length > i)
       clist.push(color[i]);
       else clist.push(getDefaultColor(i));
     if(alias.length > i)
       alist.push(alias[i]);
       else alist.push(getYLabel(pidx,i));
   }
   return [p,xidx, yidx, clist,alist, xaxis,yaxis,marker,title,label];
}

