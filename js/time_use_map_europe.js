const w=800;
const h=800;
let dataset=[]

// create a tooltip

d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position: absolute; opacity: 0;width:200px;height:100px')
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

//create SVG element

let  svg=d3.select("body")
	  .append("svg")
            .attr("width",w)
			.attr("height",h);
			

//Load, convert and scale data then draw

d3.tsv("data/france.tsv")
	.row((d,i)=> {
		return {codePostal:+d["Postal Code"],
                        inseeCode:+d.inseecode,
                        place: d.place,
                        longitude: +d.x,
                        latitude: +d.y,
                        population: +d.population,
                        density: +d.density
                };
	    })
	.get((error,rows) => {
		 console.log("Loaded "+rows.length+" rows");
		 if (rows.length>0) {
			  console.log("First row: ",rows[0])
			  console.log("Last row: ",rows[rows.length-1])
		 }

		dataset=rows;

x=d3.scaleLinear()
    .domain(d3.extent(dataset,(row) => row.longitude))
    .range([0,w]);

y=d3.scaleLinear()
    .domain(d3.extent(dataset,(row) => row.latitude))
	.range([h,0]);

radius=d3.scaleLinear()
         .domain(d3.extent(dataset,(row) => row.density))
	     .range([1,10]);

radius1=d3.scaleLinear()
         .domain(d3.extent(dataset,(row) => row.population))
	     .range([1,w]);
	
x_axis = d3.axisBottom()
		   .scale(x);

svg.append("g")
		   .call(x_axis);

		draw();

	});

function draw(){
	svg.selectAll("circle")
	   .data(dataset)
	   .enter()
	   .append("circle")
	   .attr("cx",(d) => x(d.longitude) )
	   .attr("cy",(d) => y(d.latitude) )
	   .attr("r",(d) => radius(d.density))
	   .style("fill","#696969")
	   .attr("stroke-width", 3)
	   .attr("fill-opacity", .4)
	   .on('mouseover', function(d) {
 d3.select('#tooltip')
   .transition()
   .duration(200)
   .style('opacity', 1)
   .text("Place:"+d.place+", Code Postal: "+d.codePostal+", Population: "+d.population+", density: "+d.density)
 })
 .on('mouseout', function() {
 d3.select('#tooltip').style('opacity', 0)
 })
 .on('mousemove', function() {
 d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
 })


}


	


