# line-viewer

Plotting line charts using plotly

## File Formats

The viewer assumes a simple CSV file format

The line-viewer can be invoked with one or more CSV datafiles

By default, the first column of the CSV is assumed to be the X value, while the second column is assumed to be the Y value  

## Download and Run 

You can clone the source repository with Git by running:

  git clone https://github.com/informatics-isi-edu/line-viewer.git

and invoke the viewer as in **Examples**
## Parameters
 
Parameters are optional and are organized per **url**, first in-first out.  They are used to alter the look and feel of the traces and also mark the columns to be used for each trace (x/y)

| Parameter | type | Note | Description |
| --- | --- | --- | --- |
| x | integer | CSV column index | not all columns needs to be used unless xy is specified. |
| y | integer | CSV column index | not all columns needs to be used unless xy is specified. |
| xy | chars | xy index mode | **crossall**, interleaving, x=0&y=1&x=2&y=3,first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 2 for x axis and column 3 for y axis ; **oneall**, x=0&y=1&y=2, first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 0 for x axis, column 2 for y axis | 
| alias | chars | trace name | used for labeling the name of trace and on plot legend. Default to column name from CSV header if not supplied |
| color | chars | trace color| **rgb(16,32,77)**, **blue**, **10204D**, or **#10204D**. There is a default set of color being used if none is specified |
| marker | chars | trace line | what to draw for the traces.  **lines**(default), **markers** , or **lines+markers**. Either lines, points for the data points only, or both the lines and points |
| xaxis | chars | x label | X axis label |
| yaxis | chars | y label | Y axis label |
| skip | integer | row skip |  number of lines to skip in the beginning of the file as part of header |
|   title | chars | plot title | title of the plot |
|   aliasLabel (chars) | datafile | label for datafile, default(file stub) shows up in the pull-out panel |

## Multiple CSV datafiles

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

