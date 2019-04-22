function drawTreeChord(data,id) {  

  var height = 500, width = 960,
    outerRadius = Math.min(width, height) * 0.5 - 40,
    innerRadius = outerRadius -30,
    margin = {top:100, left:10,bottom:105,right:80},
    padAngle = .02,
    trunkSpacer = 15,
    branchSpacer = 1
  
  var tree = makeTree(data,"Beach Club Villas", 'sourceBranch','targetBranch')
  
  var chord = d3.chord()
    .padAngle(padAngle)
    .sortSubgroups(d3.descending);

  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  var ribbon = d3.ribbon()
    .radius(innerRadius)

  var formatValue = d3.formatPrefix(",.0", 1e3)

  var indexBySource = (function(arr) {
    var map = d3.map(), n = 0;
    arr.forEach(function(d) {
      if(!map.has(d.source)) map.set(d.source,n++);
    })
    return map;
  })(tree)

  var branchBySource = (function(arr) {
    var map = d3.map(), n=0;
    arr.forEach(function(d) {
      if(!map.has(d.branch)) map.set(d.source,d.branch) 
    })    
    return map;
  })(tree);

  var sourceByIndex = (function(arr)  {
    var map = d3.map(), n = 0;
    arr.keys().forEach(function(d) {
      if(!map.has(d)) map.set(n++,d);
    })  
    return map;
  })(branchBySource)


  var color =  d3.scaleOrdinal([0,1,2,3,4].map(function(d) { return d3.interpolateRainbow(d/6) }))
    .domain(d3.set(branchBySource.values()).values())

  var matrix = indexBySource.keys().map(function(src) {
      return indexBySource.keys().map(function(tar) {
        var op =  tree.filter(function(d) { return d.source == src && d.target == tar;})[0] || {freq:0};
        return op.freq;
      })
    });

  var treeRotation = (function() {
    var padDegrees = padAngle * 180/Math.PI,
      totalPadDegrees = (sourceByIndex.keys().length - 1) * padDegrees,
      rootFreq = d3.sum(matrix[1]),
      arcRotate = ((trunkSpacer + rootFreq/2)/d3.sum(tree, function(d) { return d.freq }))*(360-totalPadDegrees);
    return -(arcRotate + padDegrees) + 180;  
  })();


  function makeTree(data,hubName,sbn,tbn) {
    
    // sort the data for adding spacers
    data = data.sort(twigSorter);
    
    var sources = d3.set(data, function(d) { return d.source }).values()
    var targets = d3.set(data, function(d) { return d.target }).values()
    
    targets.forEach(function(d) { 
      if(!(sources.includes(d))) {
        var row = data.filter(function(e) { return e.target == d })[0];
        var o = {};
        o.source = d;
        o.target = d;
        o[sbn] = row[tbn];
        o[tbn] = row[tbn]
        o.freq = 0;
        data.push(o);
      }
    })
    
    data = data.sort(twigSorter);
    
    var output = [];
    
    data.forEach(function(d,i) {
      
      // Insert first hub spacer
      if(i == 0) output.push({source:'hubSpacer1',target:'hubSpacer1', branch:"spacer", freq:trunkSpacer});
      
      if(d.source != hubName && data[i-1].source != hubName && data[i-1][sbn] != d[sbn] ) {
        output.push({source:d[sbn]+'spacer',target:d[sbn]+'spacer', branch:"spacer", freq:branchSpacer});
      }
      
      if(d.source != hubName && data[i-1].source == hubName) {
        output.push({source:'hubSpacer2',target:'hubSpacer2', branch:"spacer", freq:trunkSpacer});
      }
      
      // Insert data  
      output.push({source:d.source,target:d.target,branch:d[sbn], freq:d.freq});
      // Insert second hub spacer 
    })
    
    var sources = d3.set(data, function(d) { return d.source }).values()
    var targets = d3.set(data, function(d) { return d.target }).values()
    
    targets.forEach(function(d) { 
      if(!(sources.includes(d))) {
        var row = data.filter(function(e) { return e.target == d })[0];
        output.push({source:d,target:d,branch:row[tbn], freq:0});
      }
    })
    
    return output; 
    
    function twigSorter(a,b) {
      if(a.source == hubName) return -1;
      if(b.source == hubName)  return 1;
      
      if(a[sbn] == b[sbn]) {
        if(a.source > b.source) return 1;
        if(a.source < b.source) return -1;
      } else {
        if(a[sbn] > b[sbn]) return 1;
        if(a[sbn] < b[sbn]) return -1;
      }
    }
    
  }

  d3.select('#'+id).selectAll('*').remove();

  var svg = d3.select('#'+id)
    .append('svg')

  var g = svg
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
    .append("g")
    .attr("transform","translate(" + (margin.left + width/2)+ "," + (margin.top + height/2) + ")")
    .append("g")
    .attr("transform","rotate(" + treeRotation + ")")
    .datum(chord(matrix));
    
    var group = g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) { return chords.groups; })
      .enter()
      .append("g")
        .style("display", function(d) { if( branchBySource.get(sourceByIndex.get(d.index)) == 'spacer') {
            return 'none';}
        else {
            return null;
          }
      })

    group.append("path")
      .style("fill", function(d) { return color(branchBySource.get(sourceByIndex.get(d.index))); })
      .style("stroke", function(d) { return d3.rgb(color(branchBySource.get(sourceByIndex.get(d.index)))).darker(); })
      .attr("d", arc)  	

    
    group.append("text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + (innerRadius + 35) + ")"
              + (d.angle > Math.PI - treeRotation*Math.PI/180 && d.angle < 2*Math.PI - treeRotation*Math.PI/180 ? "rotate(180)" : "");
        })
        .style("text-anchor", function(d) { return d.angle > Math.PI - treeRotation*Math.PI/180 && d.angle < 2*Math.PI - treeRotation*Math.PI/180 ? "end" : null; })
        .text(function(d) { return sourceByIndex.get(d.index); });
    
    g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) { return chords; })
      .enter()
      .append("path")
      .style('mix-blend-mode','multiply')
      .attr("d", ribbon)
      .style("fill", function(d) { return color(branchBySource.get(sourceByIndex.get(d.target.index))); })
      .style("stroke", function(d) { return d3.rgb(color(branchBySource.get(sourceByIndex.get(d.target.index)))).darker(); })
      .style("display", function(d) {
        if( branchBySource.get(sourceByIndex.get(d.source.index)) == 'spacer') {
            return 'none';
          } else {
            return null;
          }
      })
} 