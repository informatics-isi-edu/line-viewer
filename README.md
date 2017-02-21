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

 
 The commandline parameters that can be set are per url, first in-first out
and alter the look and feel of the line chart and also mark the columns
to be used for each trace (x/y)

| Command | Description |
| --- | --- |
| x = (integer) csv column idx | not all columns needs to be used unless xy is specified. |
| y = (integer) csv column idx | not all columns needs to be used unless xy is specified. |
| xy = (chars) xy index mode: 'oneall', 'crossall' | oneall, interleaving x,y; crossall, x=0&y=1&y=2... |
| alias = (chars) trace name , default(column name from csv header) | |
| color = (chars) trace | color |
| xaxis = (chars) label | X axis label |
| yaxis = (chars) label | Y axis label |
| marker = (chars) 'markers'(default), 'lines', or 'lines+markers' | determines the types of line to be drawn |
| skip = (integer) | number of lines to skip in the beginning of the file as part of header |
|   title = (chars) | title of the plot |
|   aliasLabel = (chars) label for datafile, default(file stub) shows up in the pull-out panel

## Examples

Plot lines in a single file.

view.html?url=http://localhost/data/data1.csv

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

