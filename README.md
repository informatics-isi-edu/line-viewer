# line-viewer

plotting line charts using plotly

line-viewer can be invoked with one or more csv datafiles

## File Formats

The viewer assumes a simple CSV file format.

By default, the first column of the CSV is assumed to be the X value, while the second column is assumed to be the Y value.  

WHAT ABOUT HEADERS?

WHAT ABOUT SUBSEQUENT COLUMNS.


by default, the first column is treated as x, and second column is treated
as y, as the trace data being passed to plotly's line chart layout.

 ## Involking
 
 DESCRIBE HOW THE COMMAND IS TO BE INVOLKED.... 
 ONE THING THAT IS NOT CLEAR TO ME IS HOW MULTIPLE URLS ARE USED.
 
 SHOULD SAY SOMETHING LIKE WE CAN SPECIFY MULTIPLE CSV FILES (HOW), AND THAT EARCH FILE CAN HAVE A SET OF PARAMETERS.
 
 
 The commandline parameters that can be set are per **url**, first in-first out
and alter the look and feel of the line chart and also mark the columns
to be used for each trace (x/y)

| Parameter | Description |
| --- | --- |
| x = (integer) csv column idx | not all columns needs to be used unless xy is specified. |
| y = (integer) csv column idx | not all columns needs to be used unless xy is specified. |
| xy = (chars) xy index mode | 'crossall', interleaving, x=0&y=1&x=2&y=3,first trace uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 2 for x axis and column 3 for y axis ; 'oneall', x=0&y=1&y=2, first traces uses column 0 for x axis, column 1 for y axis and 2nd trace uses column 0 for x axis, column 2 for y axis | 
| alias = (chars) | trace name.  Defaults to column name from csv header ** HOW DO I SPECIFY THE TRACENAME FOR MORE THEN ONE TRACE?  ALSO, SHOULD WE CONSIDER CHANGING THIS TO BE TRACENAME, RATHER THEN ALIAS, OR IS ALIAS SOMETHING THAT PLOTLY KNOWS ABOUT |
| color = (chars) trace | color ** WHAT VALUES CAN BE USED HERE?**|
| xaxis = (chars) label | X axis label ** WHAT HAPPENDS IF WE HAVE A SECOND FILE WITH AN XAXIS LABEL**|
| yaxis = (chars) label | Y axis label |
| marker = (chars) | Determines the types of line to be drawn.  Value can be 'markers' (default), 'lines', or 'lines+markers' ** Can we explain better what this means?**|
| skip = (integer) | number of lines to skip in the beginning of the file as part of header |
|   title = (chars) | title of the plot ** WHAT HAPPENS IF WE HAVE A SECOND FILE WITH A TITLE** |
|   aliasLabel = (chars) | label for datafile, default(file stub) shows up in the pull-out panel |

## Examples

Plot a line in a single file without any parameters.

```
view.html?url=http://localhost/data/data1.csv

```

Plot two lines from a file.

```
view.html?url=http://localhost/data/data1.csv
             x=0&
             y=1&
             x=2&
             y=3&
             title='Two lines from data1.csv'

```

Plot lines from two files with custom parameters.

```
view.html?url=http://localhost/data/data1.csv&
             xy=crossall&
             xaxis='Temperature'&
             yaxis='Y axis'&
             marker='markers+lines'&
             alias='First line'&
             title='Title of the plot'&
             aliasLabel='datafile#1'&
          url=http://localhost/data/data2.csv&
             x=0&
             y=1&
             y=2&
             y=3&
             xaxis='Temperature2'&
             yaxis='Y'&
             marker='lines'&
             alias=First&
             alias=Second&
             alias=Third&
             xaxis='2nd Temperature'&
             title='Title2'
```

