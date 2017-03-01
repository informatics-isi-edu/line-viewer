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
var initAlias=[]; // alias for each header lines to be used as label
var initColor=[]; //initial color supplied by user
var myColor=[];   // color to be used - merged from initColor&defaultColor
var initSkip=[];  // skip how many lines as part of header
var initXAxis=[];
var initYAxis=[];
var initMarker=[]; 'markers', 'lines', 'lines+markers'
var initTitle=[]; // title for the plot,
var initLabel=[]; // label for the datafile
var initXY=[]; // mode for picking x, y index
var initTrace=[]; // trace for storing trace property
var initHeader=[]; // true/false to show if csv file has a row of header
                   // or not, if false, then header label needs to be
                   // supplement with index of column

// http://localhost/synapse/view.html?
//     url=http://localhost/data/synapse/segments-dummy.csv


// per url, first-in first-out
// 
// xy = (chars) xy index mode: 'shareX', 'interleave' or
//         [ {"x":0,"y":1},{"x":2,"y":3}..]
//   x = (integer) csv column idx
//   y = (integer) csv column idx
// trace = [ { "id":0,"name":"firstTrace","color":"blue","marker":"lines+markers"},
//           { "headerY":"column-header","name":"thirdTrace"}]
//           { "id":3,"name":"fourthTrace","marker":"lines"}] **
//   alias = (chars) trace name , default(column name)
//   color = (chars) trace color  
//   marker = (chars) 'markers'(default), 'lines', or 'lines+markers'
//
// xaxis = (chars) xaxis label
// yaxis = (chars) yaxis label
// skip = (integer) number of lines to skip for the header
// aliasLabel = (chars) label for datafile, default(file stub)
//
// header = true or false, to handle bare csv file
// skip = (integer) number of lines to skip after the first row of header
// 
// ** using trace to define th trace characteristics is limited in
//    several ways, it assumes, y column can only be used once and only
//    once in a plot and header column name must be unique within the plot.
//    Ideally the number of traces should corresponds with the (x,y) pairing
//    but not necessarily



function processArgs(args) {
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
             marker.push(t);
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
          case 'header': 
             {
             var t=trimQ(kvp[1]);
             header=true; 
             if(t=='false')
               header=false;
             break;
             }
          case 'xy': 
             {
             var t=trimQ(kvp[1]);
             xy=t;
             break;
             }
          case 'trace': 
             {
             var t=trimQ(kvp[1]);
             trace=t;
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
              var xya = JSON.parse(tmp);
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
            var trace = JSON.parse(tmp);
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
// in the tracelist, start is where to start searching
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

