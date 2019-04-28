# Global.R
# Required Packages

library("jsonlite")
library("shinyjs")
library("shinydashboard")
library("shiny")
library("DT")
suppressPackageStartupMessages(library('dplyr'))

d3Data <- read.csv('data/disneyWorldData.csv',stringsAsFactors = F)

getD3DataTable <- function(df) {
  DT::datatable(
    df,
    class = c('display'),
    selection = "none",
    rownames = FALSE,
    colnames = c('From','To','Park From', 'Park To', 'Freq.')
  )
}


deckData <- (function(months,years) {
  months <- as.character(months);
  months <- ifelse(nchar(months) > 1, months, paste0('0',months))
  dates <- as.character(interaction(years,months,sep='-'))
  dfs <- lapply(dates, function(x) { 
    read.csv(sprintf('data/%s-city-of-london-street.csv', x), stringsAsFactors = F)
  })
  na.omit(do.call(rbind,dfs)[,c("Longitude","Latitude")])
})(seq(1,12,1), seq(2017,2018,1))

getDeckDataTable <- function(df) {
  DT::datatable(
    df,
    class = c('display'),
    selection = "none",
    rownames = FALSE,
    colnames = c('Longitude','Latitude')
  )
}
