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

The viewer assumes a simple CSV file format.
The files may have an optional header row. Each column in the file is identified by an index, numbered starting from 1 from left to right.  Each trace within a file consists of X and Y pair, where the X and Y are identified by their respective column index.  

By default, we assume that a header row is always present.  We require that value in the header row all be unique. If there is no header, then the `header` parameter should be set to ``false``. In addition, we support CSV files that may have a lines of metadata prior to the header or first data row.  The ``skiprows`` parameter can be used to specify how many of these rows occur before the header (if ``header`` is true), or first data row (if ``header`` is false).

By default, the first column of the CSV is assumed to be the X value, while the second and subsequent columns are assumed to be the Y values.  So for example the traces would be (1,2), (1,3), (1,4), etc. 

line-viewer also supports an **interleaved** column layout in which columns are assumed to be orginized in X,Y pairs:  (1,2), (3,4), (5,6), etc.

It is also possible to enumerate traces explicilty by providing specific XY column pairings.

## Column Names 

A column is named by its file name and the index of the column within that file.  If there is only one file, the file name may be omitted.  The file name consists of the last component of the URL specifying the file.  We require that all file names be unique.

A column within a file is identified by either its column index, or by the value in its column heading if it exists.  

## Trace Names

Each trace is assigned a name using the name of its Y column.  In addition, a trace may be defined an explicit name using the ``tracenames`` parameter.  

## Plot Names

By default, plots are assigned a name that is the terminal component of the URL path.  These are assumed to be unique in any one use of this routine.  Alternative plot names can be assigned using the ``plotname`` parameter.

## Involking line-viewer

Paremeters may be passed to line-viewer as a URL query parameter.  

Parameter can apply to a file, trace, or plot.  Parameters are processed in their order of occurrence in the query string.  
Parameters may specify options at the file, trace or plot level. Parameters are processed in order.  In the case of repeated plot level parameters, the last value is the one that is used.  Parameters apply to the last url specified.  

| Parameter | Value | Level | Description |
| --- | --- | --- | --- |
| **url** | URL1,URL2 | Plot | A set of URLs of the CSV files to be used for each plot. Usually, one URL is used. |
| **csvlayout** | (sharedx\|interleaved\|custom) | File | specific orgiization of traces within the CSV file | 
| **traces** | X1;Y1,X2;Y2,... | File | A set of columns to be used for plotting the traces. If csvlayout is custom, provides a list of trace definitions, otherwise ignore. Trace definition can use column heading (if available) or column indexes.|
| **tracenames** | ycolumnname1;tracename1,ycolumname2;tracename2,... | trace  | By default, a trace is named by the name of its Y column (i.e. its index or heading value). You can override the default trace name using this parameter.  |
| **color** | ycolumnname1;color1,ycolumnname2;color2,... | Plot | A color can be specified in the RGB values, text, or color number e.g. **rgb(16,32,77)**, **blue**, **10204D**, or **#10204D**. There is a default set of color being used if none is specified |
| **marker** | (lines\|markers\|lines+markers) | Plot | what to draw for the traces. Default is lines. Either lines, points for the data points, or both the lines and points |
| **xaxislable** | chars | Plot | X axis label |
| **yaxislable** | chars | Plot | Y axis label |
| **skiprows** | integer | File |  number of lines to skip in the beginning of the file. It defaults to 0.|
| **header** | true/false | File | Header (default to true) indicates whether a header row is provided in the data set.  The header row is the (**skippedrows**+1)th row. |
| **title** | chars | Plot | title of the plot |
| **plotname** | (filename\|tracelist) | Plot | label for datafile, default(file stub) shows up in the pull-out panel |

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

