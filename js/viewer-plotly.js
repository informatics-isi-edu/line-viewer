//
// line-viewer
//
var savePlot=[]; // first one is threeD, 2nd is subplots

//[p,xidx, yidx, clist,alist, xaxis,yaxis,marker,title,label];
//addLinesPlot(pdata, config, frameWidth-5, frameHeight-5);
function addLinesPlot(divname, config, fwidth, fheight) {
  var pdata=config[0];
  var xkeys=config[1];
  var ykeys=config[2];
  var clist=config[3];
  var alist=config[4];
  var xaxis=config[5];
  var yaxis=config[6];
  var marker=config[7];
  var title=config[8];
  var label=config[9];

  var xrange=getMinMax(pdata,xkeys);
  var yrange=getMinMax(pdata,ykeys);

  var _data=getLinesAt(pdata,xkeys,ykeys,clist,marker,alist);
  var _layout=getLinesDefaultLayout(fwidth, fheight,xaxis,yaxis,xrange,yrange,title);
  var _width=fwidth;
  var _height=fheight;

  if(fwidth > 400)
    plot=addAPlot(divname,_data, _layout, _width, _height, true);
    else
      plot=addAPlot(divname,_data, _layout, _width, _height, false);

  savePlot[0]=plot;
  return plot;
} 


function makeOneTrace(pdata,xkey,ykey,cval, mmode,name) {
  var xval=getOriginalDataByKey(pdata, xkey);
  var yval=getOriginalDataByKey(pdata, ykey);
  
  var marker_val = { 
      size:4,
      symbol:'circle', 
      color:cval, 
      opacity: 0.8,
      line: {color: "black", width: 1}
      };

  var t={ x:xval,
          y:yval, 
          marker: marker_val, 
          mode: mmode,
          type:"scatter" };

  if(name!=null) { t.name=name; }
  return t;
}

// trace and text is matching
function getLinesAt(pdata,xkeys,ykeys,color,marker,names) {
  var cnt=ykeys.length;
  var data=[];
  var _name=null;
  for (var i=0;i<cnt; i++) {
    if(names.length >=i) {
      _name=names[i];
    }
    if(xkeys.length<i) {
      var _t=xkeys.length-1;
      data.push(makeOneTrace(pdata,xkeys[_t],ykeys[i],color[i],marker,_name)); 
      } else {
        data.push(makeOneTrace(pdata,xkeys[i],ykeys[i],color[i],marker,_name)); 
    }
  }
  return data;
}

function getLinesDefaultLayout(w,h,xaxis,yaxis,xrange,yrange,title) {
  var p= {
        xaxis: {
          title: xaxis,
          showline: true,
          ticks:'inside',
          linewidth: 2,
          range:xrange,
          zeroline: false
        },
        yaxis: {
          title: yaxis,
          showline: true,
          ticks:'inside',
          linewidth: 2,
          range: yrange,
          zeroline: false 
        },
        width: w,
        height: h,
        margin: { t:50, b:40 },
        showlegend: true,
        hovermode: 'closest',
        legend: { traceorder: 'reversed' }
        };

  if(title != null) {
    p.title=title;
  }
  return p;
}

function getMinMax(pdata,keys) {
  var cnt=keys.length;
  var tmp=getOriginalDataByKey(pdata, keys[0]);
  var max=Math.max.apply(Math,tmp);
  var min=Math.min.apply(Math,tmp);
  for(var i=1;i<cnt;i++) {
    tmp=getOriginalDataByKey(pdata, keys[i]);
    var _max=Math.max.apply(Math,tmp);
    var _min=Math.min.apply(Math,tmp);
    if(_max > max) max=_max;
    if(_min < min) min=_min;
  }
//window.console.log("min,max", min, " ",max);
  return [min,max]; 
}

/**************************************************************/
function addAPlot(divname, data, layout, w, h, mode) {
  var d3 = Plotly.d3;
  var gd3 = d3.select(divname)
    .append('div')
    .style({
        width: w,
        height: h,
        visibility: 'inherit'
    });

  var gd = gd3.node();
  Plotly.newPlot(gd, data, layout, {displayModeBar: mode});
  return gd;
}

function rangeOfPlot(aPlot) {
    var aDiv=aPlot;
    var a=aDiv.layout.xaxis.range;
    var b=aDiv.layout.yaxis.range;
    return [a,b];
}

/* chop off entries that is not within the min, max range */
function rangeItByValue(data,key,min,max) {
    var _p=getOriginalDataByKey(data, key);
    var _cnt=_p.length;
    var _v;
    var _new=[];
    for( i=0; i< _cnt; i++) {
      _v=_p[i];
      if( _v > min && _v < max) {
         _new.push(_v);
      }
    }
    return _new;
}

function addPlotlyTrace(plot,target) {
  var _data=plot.data;
  if(_data.length <= target) {
    // no trace in there.
    } else {
      var update = { visible: true };
      Plotly.restyle(plot, update, [target]);
  }
}

function removePlotlyTrace(plot,target) {
  var _data=plot.data;
  if(_data.length <= target) {
    // no trace in there.
    } else {
      var update = { visible: false };
      Plotly.restyle(plot, update, [target]);
  }
}

// on/off 
function offTrace(plot_idx,data_idx) {
  var plot=savePlot[plot_idx];
  removePlotlyTrace(plot,data_idx);
}
// on/off 
function onTrace(plot_idx,data_idx) {
  var plot=savePlot[plot_idx];
  addPlotlyTrace(plot,data_idx);
}


