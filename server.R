server <- function(input,output,session) {


  observeEvent(input$formRight, {shinyjs::runjs("$('#expandRight').click();")})

  output$d3DataTable <- DT::renderDataTable(getD3DataTable(d3Data))
  
  observe({ shinyjs::runjs(paste0('drawTreeChord(', jsonlite::toJSON(d3Data,digts=NA), ',"tree")'))})
  
  output$deckDataTable <- DT::renderDataTable(getDeckDataTable(deckData))
  
  shinyjs::runjs(paste0('updateHex(', jsonlite::toJSON(deckData,digts=NA), ')'))

}
