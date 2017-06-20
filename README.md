# line-viewer

Simple line charts from CSV files using plotly

## Overview

line-viewer takes one or more CSV files as an input and additional parameters and creates an interactive plot using plot.ly JavaScript line plotting routines.

Input to this program are one or more CSV files, each of which contains one or more **traces**.  

Traces are sets of coordinates that can be assigned to one or more **plots** which can be selectively displayed.  Within a plot, traces can be turned on and off interactively.

## Download and Run 

You can clone the source repository with Git by running:

  git clone https://github.com/informatics-isi-edu/line-viewer.git

and invoke the viewer as in **Examples**


## File Formats

The viewer assumes a simple CSV file format.  Files are specified by a URL, and within line-viewer, are refered to by a file name (filename), The file name consists of the last component of the URL path.  We require that all file names be unique.

The files may have an optional header row. Each column in the file is identified by an index, numbered starting from 0 from left to right.  Each trace within a file consists of X and Y pair, where the X and Y are identified by their respective column index or the respective value in the header row, if present.  

By default, we assume that a header row is always present.  We require that values in the header row all be unique. If there is no header, then the `header` parameter should be set to ``false``. In addition, we support CSV files that may have lines of metadata prior to the header or first data row.  The ``skiprow`` parameter can be used to specify how many of these rows occur before the header (if ``header`` is true), or first data row (if ``header`` is false).

By default, the first column of the CSV is assumed to be the X value, while the second and subsequent columns are assumed to be the Y values.  So for example the traces would be (0,1), (0,2), (0,3), etc. 

line-viewer also supports an **interleaved** column layout in which columns are assumed to be orginized in X,Y pairs:  (0,1), (2,3), (4,5), etc.

It is also possible to enumerate traces explicilty by providing specific XY column pairings.

## Column Names 

A column within a file is identified by its column index(index starting with 0).  

## Trace Names

Each trace is assigned a name using the name of its Y column.  In addition, a trace may be defined an explicit name using the ``alias`` parameter.  

## Plot Names

By default, all of the traces in a file are grouped into a plot which is named by the file name.  Alternative plot names can be assigned using the ``title`` parameter.

## Invoking line-viewer

Paremeters may be passed to line-viewer as a URL query parameter.  
Parameters are optional and are organized per **url**, first in-first out when explicitly expressed.

Parameters may specify options at the trace or file/plot level. The ``url`` for a file must be specified before any of the trace, or file/plot level paramters that are related to that file.  In the case of repeated parameters, the last value is the one that is used. 

| Parameter | Value | Level | Description |
| --- | --- | --- | --- |
| **url** | URL | file/plot | one or more URLs of the CSV datafiles to be used for each plot. For each URL you can optionally specify the layout |
| **xylayout** | chars | file/plot | layout for selecting CSV columns used for plotting. **interleave** x=0&y=1&x=2&y=3, first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 2 for x axis and column 3 for y axis; **shareX**, x=0&y=1&y=2, first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 0 for x axis, column 2 for y axis; or explicitly as [ {"x":0,"y":1},{"x":2,"y":3},...] |
| **x** | integer | trace | CSV column index to be used for x. xylayout takes precedence if declared |
| **y** | integer | trace | CSV column index to be used for y. xylayout takes precedence if declared |
| **alias** | chars | trace | trace name used for labeling the name of trace. Default to column name from CSV header if not supplied |
| **color** | chars | trace | a color can be specified in the RGB values, text, or color number e.g. **rgb(16,32,77)**, **blue**, **10204D**, or **#10204D**. There is a default set of color being used if none is specified |
| **marker** | chars | trace |  what to draw for the traces. **lines** just lines; **markers** dots on datapoint ; **lines+markers** dots with lines; Default is lines |
| **xaxislabel** | chars | file/plot | X axis label |
| **yaxislabel** | chars | file/plot | Y axis label |
| **skiprow** | integer | file/plot | number of lines to skip in the beginning of the datafile. Defaults to 0|
| **title** | chars | file/plot | title of the plot  |
| **header** | boolean | file/plot | to allow bare CSV file (without header) |
| **aliaslabel** | chars | file/plot | an alias for the datafile, default(file stub) shows up in the pull-out panel |

## Multiple Plots

Click on the blue pull-out icon at upper left corner will slide out a list of datafiles. Toggle the dot icon will switch among the available datafiles. The last option is the combined plot of all datafiles

## Examples 

Plot a line in a single CSV file without any parameter

```
view.html?url=http://localhost/data/data1.csv

```

Plot two lines from a single CSV file

```
view.html?url=http://localhost/data/data1.csv
             x=0&
             y=1&
             x=2&
             y=3&
             title='Two lines from data1.csv'

```

Plot multiple lines from two CSV datafiles with some custom parameters

```
view.html?url=http://localhost/data/data1.csv&
             xylayout=shareX&
             xaxislabel=Temperature&
             yaxislabel='Y axis'&
             marker='markers+lines'&
             alias='First line'&
             title='Title of the plot'&
             aliaslabel=datafile#1&
          url=http://localhost/data/data2.csv&
             x=0&
             y=1&
             y=2&
             y=3&
             xaxislabel='2nd Temperature'&
             yaxislabel=Y&
             marker=lines&
             alias=First&
             alias=Second&
             alias=Third&
             title=Title2
```

More sample examples including preliminary json structured configuration are in viewer-line.js

Sample plot is in sample.png
