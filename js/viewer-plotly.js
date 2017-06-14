//
// line-viewer
//
var savePlot=[]; 

//each config=
//   [p,xidx, yidx, clist,alist, mlist, xaxis,yaxis,title,label]
function addLinePlot(divname, configs, fwidth, fheight) {
  var pcnt=configs.length; //
  if(pcnt < 1) 
    return;
  var config1=configs[0];
  var pdata=config1[0];
  var xkeys=config1[1];
  var ykeys=config1[2];
  var clist=config1[3];
  var alist=config1[4];
  var mlist=config1[5];
  var xaxis=config1[6];
  var yaxis=config1[7];
  var title=config1[8];
  var label=config1[9];

/* need to get range separately and then combine.. */
  var xrange=getMinMax(pdata,xkeys,true);
  var yrange=getMinMax(pdata,ykeys,true);

// get the data for the first set
  var _data=getLinesAt(pdata,xkeys,ykeys,clist,mlist,alist);

  for(var i=1; i<pcnt; i++) {
    var t=configs[i];
    if(t[6]!=null) xaxis=xaxis+","+t[6];
    if(t[7]!=null) yaxis=yaxis+","+t[7];
    if(t[8]!=null) title=title+","+t[8];
    if(t[9]!=null) label=label+","+t[9];
    var pd=t[0];
    var xk=t[1];
    var yk=t[2];
    var cl=t[3];
    var al=t[4];
    var ml=t[5];
    var xr=getMinMax(pd,xk,true);
    var yr=getMinMax(pd,yk,true);
    if(xr[0] < xrange[0]) xrange[0]=xr[0];
    if(xr[1] > xrange[1]) xrange[1]=xr[1];
    if(yr[0] < yrange[0]) yrange[0]=yr[0];
    if(yr[1] > yrange[1]) yrange[1]=yr[1];
    var kcnt=xk.length;
    for(j=0;j<kcnt;j++) { // add more data
      _data.push(makeOneTrace(pd,xk[j],yk[j],cl[j],ml[j],al[j]));
    }
  }

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
    if(xkeys.length-1 <= i) {
      var _t=xkeys.length-1;
      data.push(makeOneTrace(pdata,xkeys[_t],ykeys[i],color[i],marker[i],_name)); 
      } else {
        data.push(makeOneTrace(pdata,xkeys[i],ykeys[i],color[i],marker[i],_name)); 
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

function getMinMax(pdata,keys,pad) {
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
  if(pad) {
    min=min*(1.01);
    max=max*(1.01);
  }
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


