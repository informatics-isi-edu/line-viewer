# line-viewer

Plotting line charts using plotly

line-viewer can be invoked with one or more csv datafiles

## File Formats

The viewer assumes a simple CSV file format.

By default, the first column of the CSV is assumed to be the X value, while the second column is assumed to be the Y value.  

## Parameters
 
Parameters are optional and are organized per **url**, first in-first out.  They are used to alter the look and feel of the traces and also mark the columns to be used for each trace (x/y)

| Parameter | Description |
| --- | --- |
| x = (integer) csv column idx | not all columns needs to be used unless xy is specified. |
| y = (integer) csv column idx | not all columns needs to be used unless xy is specified. |

| xy = (chars) xy index mode | **crossall**, interleaving, x=0&y=1&x=2&y=3,first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 2 for x axis and column 3 for y axis ; **oneall**, x=0&y=1&y=2, first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 0 for x axis, column 2 for y axis | 
| alias = (chars) | trace name.  Defaults to column name from csv header |
| color = (chars) trace | plotly color, **rgb(16,32,77)**, **blue**, **10204D** |
| xaxis = (chars) label | X axis label |
| yaxis = (chars) label | Y axis label |
| marker = (chars) | plotly marker. What to draw for the traces.  **lines**(default), **markers** , or **lines+markers**. Either lines, points for the data points only, or both the lines and points |
| skip = (integer) | number of lines to skip in the beginning of the file as part of header |
|   title = (chars) | title of the plot |
|   aliasLabel = (chars) | label for datafile, default(file stub) shows up in the pull-out panel |

## Invoking examples

Plot a line in a single file without any parameters.

```
view.html?url=http://localhost/data/data1.csv

```

Plot two lines from a single file.

```
view.html?url=http://localhost/data/data1.csv
             x=0&
             y=1&
             x=2&
             y=3&
             title='Two lines from data1.csv'

```

Plot multiple lines from two data files with some custom parameters.

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

