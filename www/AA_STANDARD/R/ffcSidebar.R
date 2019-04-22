tagList(
  tags$aside(
    class='control-sidebar control-sidebar-dark',
    style='padding-left:8px;padding-right:8px',
    h4('Flag for Collaboration'),
    selectizeInput(
      'ffcsubTeam',
      label = 'Team/Dept', choices = c('NASI QA', 'SOA QA', 'Data Mining' )
    ),
    textInput("ffcissueTxt", "Issue Shortname"),
    selectizeInput("ffcflagPrio", "Priority", choices = c("1:RESEARCHING", "2:TO RESEARCH","3:POTENTIAL EARLY WARNING",
                                                          "4:KNOWN-LOW", "5:KNOWN-MEDIUM","6:KNOWN-HIGH"), selected = "1:RESEARCHING"),
    selectizeInput("ffcmodyear", "Model Year", choices = 2020:2010,multiple = TRUE),
    selectizeInput("ffcclines", "Carline", choices = c("Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "WRX"),multiple = TRUE),
    textAreaInput("ffcflagMsg", "Notes",height = '70px',resize = 'vertical'),
    actionButton("ffcSubmit", "Submit", icon = icon("send"),
                 title="Submit this issue to the Collaboration Portal",style="width:100%;")
  ),
  tags$div(
    class = "control-sidebar-bg"
  )
)
