dashboardPage(
  title = 'Shiny Viz',
  dashboardHeader(
    title= span(icon("area-chart"), 'Shiny Viz'),
    .list = list(
      tags$li(class='dropdown',
              tags$a(href='https://www.subaru.com',
                     tags$img(src='AA_STANDARD/IMAGES/logoSmall.png',height='50'), style='padding:0px;')
      ),
      tags$li(class='dropdown', tags$a(href="#", id='expandRight', icon('edit',class = 'fa-lg'),onclick="return false;"))
    )
  ),
  dashboardSidebar(
    sidebarMenu(
      id = "sidebarMenu",
      menuItem("D3.js",  icon = icon("pie-chart"), tabName="d3")
    )
  ),
  dashboardBody(
    tagList(
      useShinyjs(),
      tags$script(HTML("$('#expandRight').attr('data-toggle','control-sidebar')")),
      tags$script(src = "https://d3js.org/d3.v5.min.js" ,type='text/javascript', language='javascript'),
      tags$script(src = 'AA_STANDARD/JS/aaScript.js', type='text/javascript', language='javascript'),
      tags$script(src = 'treeChord.js', type ='text/javascript', language='javascript'),
      tags$head(
        tags$script(src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"),
        tags$script(HTML("WebFont.load({google: {families: ['Play']}});")),
        tags$link(rel = "stylesheet", type = "text/css", href = "AA_STANDARD/CSS/aaStyle.css")
      )
    ),
    tags$head(
      tags$link(rel = "stylesheet", type = "text/css", href = "style.css")
    ),
    tabItems(
      tabItem(
        tabName='d3',
        fluidRow(
          tabBox(
            title = "D3.js",width = 12,
            # The id lets us use input$tabset1 on the server to find the current tab
            id = "d3Tabset",
            tabPanel("Viz", div(id = 'tree')),
            tabPanel("Data", DT::dataTableOutput('d3DataTable'))
          )
        )
      )
    ),
    tagList(
      tags$aside(
        class='control-sidebar control-sidebar-dark',
        style='padding-left:8px;padding-right:8px',
        h4('Comment Form'),
        selectizeInput(
          'formTopic',
          label = 'Topic', choices = c('D3', 'Deck.gl')),
        textInput("formSubject", "Subject"),
        textAreaInput("formMessage", "Notes",height = '70px',resize = 'vertical'),
        actionButton("formSubmit", "Submit", icon = icon("send"),
                     title="Submit this Form",style="width:100%;")
      ),
      tags$div(
        class = "control-sidebar-bg"
      )
    )
  )
)
