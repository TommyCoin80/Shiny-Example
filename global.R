# Global.R
# Required Packages

library("jsonlite")
library("shinyjs")
library("shinydashboard")
library("shiny")
library("DT")
suppressPackageStartupMessages(library('dplyr'))

d3Data <- read.csv('d3data.csv',stringsAsFactors = F)

getDataTable <- function(df, dfName) {
  DT::datatable(
    df,
    class = c('display'),
    selection = "none",
    rownames = FALSE,
    colnames = c('From','To','Park From', 'Park To', 'Freq.')
  )
}
