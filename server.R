server <- function(input,output,session) {


  observeEvent(input$formRight, {shinyjs::runjs("$('#expandRight').click();")})

  output$d3DataTable <- DT::renderDataTable(getDataTable(d3Data,'d3'))
  
  observe({ shinyjs::runjs(paste0('drawTreeChord(', jsonlite::toJSON(d3Data,digts=NA), ',"tree")'))})

}
