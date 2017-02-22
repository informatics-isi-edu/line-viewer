# line-viewer

Simple line charts from CSV files using plotly

## Overview

line-viewer takes one or more CSV files as an input and additional parameters and creates an interactive plot using plot.ly JavaScript line plotting routines.

Input to this program are one or more CSV files, each of which contains one or more **traces**.  

Traces can be assigned to one or more **plots** which can selectively displayed.  Within a plot, traces can be turned on and off interactively.

## Download and Run 

You can clone the source repository with Git by running:

  git clone https://github.com/informatics-isi-edu/line-viewer.git

and invoke the viewer as in **Examples**


## File Formats

The viewer assumes a simple CSV file format.
The files may have an optional header row. Each column in the file is identified by an index, numbered starting from 1.  Each trace within a file consists of X and Y pair, where the X and Y are identified by their respective column index.  

By default, we assume that a header row is always present.  If there is no header, then the `headerrows` parameter should be set to zero.

By default, the first column of the CSV is assumed to be the X value, while the second and subsequent columns are assumed to be the Y values.  So for example the traces would be (1,2), (1,3), (1,4), etc.

line-viewer also supports an **interleaved** column layout in which columns are assumed to be orginized in X,Y pairs:  (1,2), (3,4), (5,6), etc.

It is also possible to enumerate traces explicilty by providing specific XY column pairings.

## Column Names

A column is named by its file name and the index of the column within that file.  If there is only one file, the file name may be omitted.  The file name consists of the last component of the URL specifying the file.  We require that all file names be unique.

A column within a file is identified by its column index, or by the value in its optional column heading.  If a heading value occurs more then once in the same file, then only the column index can be used.

## Trace Names

Each trace is assigned a name using the following procedure:
- If a tracename is specified as part of a 
- If a column header is provided, the header of the Y column of the trace is used.  If the same name occurs in more then one file ....
- If no header is provided, the column index of the Y column is used for the trace name.

## Plot Names

By default, plots are assigned a name that is the terminal component of the URL path.  These are assumed to be unique in any one use of this routine.  Alternative plot names can be assigned using the plotname parameter.

## Parameters
 
Parameters may specify options at the file, trace or plot level. Parameters are processed in order.  In the case of repeated plot level parameters, the last value is the one that is used.  File level parameters apply to the last file specified.  

Parameters are optional and are organized per **url**, first in-first out.  They are used to alter the look and feel of the traces and also mark the columns to be used for each trace (x/y)

| Parameter | Value | Level | Description |
| --- | --- | --- | --- |
| **x** | integer | File | Column index of X value for a trace. Not all columns needs to be used unless xy is specified. |
| **y** | integer | File | Column index of Y value for a trace. not all columns needs to be used unless xy is specified. |
| **csvlayout** | (sharedx \| interleaved\|custom) | File | specifies orgiization of traces within the CSV file | 
| **traces** | X1,Y1;X2,Y2,... | File | If csvlayout is custom, provides a list of trace definitions|
| **tracenames** | columnname,columnname,... | trace  | used for labeling the name of trace and on plot legend. Default to column name from CSV header if not supplied |
| **color** | chars | Plot | **rgb(16,32,77)**, **blue**, **10204D**, or **#10204D**. There is a default set of color being used if none is specified |
| **marker** | (lines\|markers\|lines+markers) | Plot | what to draw for the traces. Default is lines. Either lines, points for the data points, or both the lines and points |
| **xaxislable** | chars | Plot | X axis label |
| **yaxislable** | chars | Plot | Y axis label |
| **headerrows** | integer | File |  number of lines to skip in the beginning of the file as part of header. It defaults to 1. This value should be set to 0 if there is no header.|
| **title** | chars | Plot | title of the plot |
| **plotname** | (filename\|tracelist) | File | label for datafile, default(file stub) shows up in the pull-out panel |

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

