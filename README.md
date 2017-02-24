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

The files may have an optional header row. Each column in the file is identified by an index, numbered starting from 1 from left to right.  Each trace within a file consists of X and Y pair, where the X and Y are identified by their respective column index or the respective value in the header row, if present.  

By default, we assume that a header row is always present.  We require that values in the header row all be unique. If there is no header, then the `header` parameter should be set to ``false``. In addition, we support CSV files that may have lines of metadata prior to the header or first data row.  The ``skiprows`` parameter can be used to specify how many of these rows occur before the header (if ``header`` is true), or first data row (if ``header`` is false).

By default, the first column of the CSV is assumed to be the X value, while the second and subsequent columns are assumed to be the Y values.  So for example the traces would be (1,2), (1,3), (1,4), etc. 

line-viewer also supports an **interleaved** column layout in which columns are assumed to be orginized in X,Y pairs:  (1,2), (3,4), (5,6), etc.

It is also possible to enumerate traces explicilty by providing specific XY column pairings.

## Column Names 

A column within a file is identified by either its column index, or by the value in its column heading if it exists.  
Within line-viewer, we provide a global name for a column by specifying both its file name and the name of the column within that file, e.g. filename:index or filename:headervalue.  If there is only one file, the file name may be omitted.

## Trace Names

Each trace is assigned a name using the name of its Y column.  In addition, a trace may be defined an explicit name using the ``tracenames`` parameter.  

## Plot Names

Traces are grouped into named plots.  By default, all of the traces in a file are grouped inot a plot which is named by the file name.  Alternative plot names can be assigned using the ``plotname`` parameter.

## Involking line-viewer

Paremeters may be passed to line-viewer as a URL query parameter.  

Parameter can apply to a file, trace, or plot.  
Parameters may specify options at the file, trace or plot level. The ``url`` for a file must be specified before any of the trace, plot, or file level paramters that are related to that file.  In the case of repeated parameters, the last value is the one that is used. 

| Parameter | Value | Level | Description |
| --- | --- | --- | --- |
| **url** | URL1,URL2, ... | Plot | A set of URLs of the CSV files to be used for each plot. Usually, one URL is used.|
| **url proposed** | URL1;csvlayout;alias,URL2;csvlayout;alias, ... | Plot | A set of URLs of the CSV files to be used for each plot. For each URL you can optionally specify the layout and a file alias to be used to name the file columns.  The csvlayout can be sharedx, interleaved, or custom, with the default being sharedx.  If omitted, the file alias will default to the last component of the URL.  If the same last component of the URL path appears in more then one URL, then the file alias must be provided to disambiguate.|
| **csvlayout** | filename:(sharedx\|interleaved\|custom), ... | File | specific organization of traces within the CSV file | 
| **traces** | filename:X1;Y1,X2;Y2,... | File | A set of columns to be used for plotting the traces. If csvlayout is custom, provides a list of trace definitions, otherwise ignore. Trace definition can use column heading (if available) or column indexes. Can occur more then once.|
| **tracenames** | ycolumnname1:tracename1,ycolumname2:tracename2,... | trace  | By default, a trace is named by the name of its Y column (i.e. its index or heading value). You can override the default trace name using this parameter.  This parameter can occur more then once.|
| **color** | ycolumnname1:color1,ycolumnname2:color2,... | Plot | A color can be specified in the RGB values, text, or color number e.g. **rgb(16,32,77)**, **blue**, **10204D**, or **#10204D**. There is a default set of color being used if none is specified |
| **marker** | ycolumnname1:(lines\|markers\|lines+markers), ... | Plot | what to draw for the traces. Default is lines. Either lines, points for the data points, or both the lines and points |
| **xaxislabel** | plotname:label, ... | Plot | X axis label |
| **yaxislabel** | plotname:label, ... | Plot | Y axis label |
| **skiprows** | filename:integer, ... | File |  number of lines to skip in the beginning of the file. It defaults to 0.|
| **header** | filename:(true\|false) | File | Header (default to true) indicates whether a header row is provided in the data set.  The header row is the (**skiprows**+1)th row. |
| **title** | plotname:titlestring, ... | Plot | title of the plot |
| **plotname** | name:(filename\|tracelist), ... | Plot | label for datafile, default(file stub) shows up in the pull-out panel. In future version, this parameter will also allow you to specify a list of traces to be defined as a plot |

## Multiple Plots

Click on the blue pull-out icon at upper left corner will slide out a list of datafiles. Toggle the eye icons will switch among the available datafiles

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
             xy=crossall&
             xaxis=Temperature&
             yaxis='Y axis'&
             marker='markers+lines'&
             alias='First line'&
             title='Title of the plot'&
             aliasLabel=datafile#1&
          url=http://localhost/data/data2.csv&
             x=0&
             y=1&
             y=2&
             y=3&
             xaxis=Temperature2&
             yaxis=Y&
             marker=lines&
             alias=First&
             alias=Second&
             alias=Third&
             xaxis='2nd Temperature'&
             title=Title2
```

