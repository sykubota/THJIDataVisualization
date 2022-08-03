csvURL = FileAttachment("spacingField@3.csv").url()
dataCSV = d3.csv(csvURL, ({Date, Country, Event, Description, SharedOrPersonal}) => ({
  date: new window.Date(Date),
  country: Country,
  eventName: Event,
  eventDescription: Description,
  sharedOrPersonal: SharedOrPersonal,
}))
viewof eventsSelection = radio({
  title: 'Events',
  description: 'Please select which events to show',
  options: [
    { label: 'Holocaust', value: 'Holocaust' }, //I changed value from "shared" or "personal" but not 'all' because we havent defined that yet. We may need to do something about this in the future though.
    { label: 'Japanese Internment', value: 'Japanese' },
    { label: 'Comparison', value: 'all' },
  ],
  value: 'Holocaust'
})
DiDoesDigital2020Timeline = {
  const markerDefaultColor = "#9880C2";
  const markerSelectedColor = "#9880C2";
  const markerFadedColor = "#E4DDEE";
  const markerPersonalColor = "#5598E2";

  const labelDefaultColor = "#331A5B";
  const labelSelectedColor = "#331A5B";
  const labelFadedColor = "#E4DDEE";
  const labelPersonalColor = "#093B72";
  
  const annotationDefaultColor = "#E4DDEE";
  const annotationPersonalColor = "#CADFF7";
  
  const svg = d3.select(DOM.svg(params.svg.width, params.svg.height))
    .attr("title", "Timeline of Human Internment")
    .attr("id", "timeline");
  
  const chartBackground = svg.append("rect")
    .attr("id", "chart-background")
    .attr("fill", "#fff") // fallback for CSS
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", params.svg.width)
    .attr("height", params.svg.height);

  const chartTitle = svg.append("g")
      .attr("class", "chart-title")
      .append("text")
          .attr("id", "title-text")
          .attr("text-anchor", "start")
          .attr("x", width >= params.smallScreenSize ? 96 : params.event.offset)
          .attr("y", 24)
          .attr("dy", "2em")
          .style("font-weight", "700")
          .style("font-size", "clamp(1.2rem, 4vw, 2.5rem)") // minimum, preferred, maximum
          .text("Human Internment Timeline");
  //const stick = makeSticky(chartBackground, chartTitle, options);

  //TODO: we need to have the subtitle be specific to help the viewer understand what they selected
  const chartSubtitle = svg.append("g")
      .attr("class", "chart-subtitle")
      .append("text")
          .attr("text-anchor", "start")
          .attr("x", width >= params.smallScreenSize ? 96 : params.event.offset)
          .attr("y", 24)
          .attr("dy", "5.5em")
          .style("font-weight", "400")
          .style("font-size", "clamp(1rem, 2.5vw, 1.25rem)") // minimum, preferred, maximum
          .text("The Holocaust and Japanese Internment, 1933-1946");

  // const byline = svg.append("g")
  //   .attr("transform", `translate(${width >= params.smallScreenSize ? params.plot.x * 0.4 : params.event.offset}, ${params.svg.height - (params.margin.bottom / 2)})`)
  //   .append("text")
  //     .attr("id", "byline")
  //     .attr("x", 0)
  //     .attr("y", 0)
  //     .attr("dy", "0.5em")
  //     .text('Graphic by @DiDoesDigital');
  
  const plot = svg.append("g")
    .attr("id", "plot")
    .attr("transform", `translate(${width >= params.smallScreenSize ? params.plot.x : params.smallScreenMargin.left}, ${params.plot.y})`);

  const gy = plot.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .call(axis.y)
    .attr("aria-hidden", "true")
    .call(g => g.selectAll(".tick text").call(halo));

  // // right-most lines and time spans <-- we could just get rid of these (not really adding much)
  // const annotations = plot.append("g")
  //     .attr("class", "annotations")
  //     .selectAll("g")
  //   //TODO: change the fileName here
  //     .data(lockdownData)
  //     .join("g");
  
  // const annotationsLeftMargin = params.plot.x + 240 + 24;
  
  // annotations.append("line")
  //     .attr("aria-hidden", "true")
  //     .attr("stroke", annotationDefaultColor)
  //     .attr("stroke-width", 3)
  //     .attr("x1", annotationsLeftMargin)
  //     .attr("x2", annotationsLeftMargin)
  //   //TODO: we need to determine the start and end date we want. Should it be the same for both timelines?
  //     .attr("y1", d => y(d.startDate))
  //     .attr("y2", d => y(d.endDate));

  // //changes the text to the right of the right-side line
  // annotations.append("text")
  //     .attr("x", annotationsLeftMargin + 24)
  //     .attr("y", d => y(d.startDate))
  //     .attr("dy", "0.7em")
  //     .style("font-size", 16)
  //     .style("font-weight", 600)
  //     .text(d => width >= params.mediumScreenSize ? d.name : '')
    
  // annotations.append("text")
  //     .attr("x", annotationsLeftMargin + 24)
  //     .attr("y", d => y(d.startDate))
  //     .attr("dy", "2.0em")
  //     .style("font-size", 16)
  //     .style("font-weight", 400)
  //     .text(d => width >= params.mediumScreenSize ? d3.timeFormat("%e %b")(d.startDate) + " – " + d3.timeFormat("%e %b")(d.endDate) : '')
  
  //From my understanding, this handles the spacing of the circles but I can't seem to make any noticeable changes
  const dodgedYValues = dodge(data.map(d => y(d.date)), labelSeparation);
   //const dodgedYValues = data.map(d => y(d.date)); // using this aligns the text to the circles but becomes unreadable due to overlap. does NOT change circle spacing
  
  // TODO (Vanessa): Fix the spacing of events in timeline (the circles)
  const markers = plot.append("g")
    .attr("class", "markers") 
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("transform", d => `translate(0, ${y(d.date)})`) //changes x axis position if you change the 0
      .attr("aria-hidden", "true")
      .attr("fill", d => d.sharedOrPersonal === "Holocaust" ? markerDefaultColor : markerPersonalColor)
      .attr("stroke", d => d.sharedOrPersonal === "Holocaust" ? markerDefaultColor : markerPersonalColor)
      .attr("cx", 0.5) //moves circle to the left or right but doesnt change spacing
      .attr("cy", (params.marker.radius / 2) + 0.5) //moves the circles down but does not change spacing
      .attr("r", params.marker.radius);

  //TODO (Vanessa): How can I use the eventLabel as a "txt" attribute for markers? Or conversely, we know the label spacing looks good so how can I add a marker to each label?
  const eventLabels = plot.append("g")
    .attr("class", "eventLabels")
    .selectAll("text")
    .data(d => d3.zip(
      data,
      dodgedYValues,
    ))
    .join("text")
      .attr("class", "event-title")
      .style("font-weight", "400")
      .style("fill", ([d]) => d.sharedOrPersonal === "Holocaust" ? labelDefaultColor : labelPersonalColor)
      .attr("x", width >= params.smallScreenSize ? params.event.offset : params.smallScreenEvent.offset)
      .attr("y", ([, y]) => y)
      .attr("dy", "0.35em");
    
  eventLabels.append("tspan")
      .text(([d]) => d.eventName);
  eventLabels.append("tspan")
      .text(([d]) => ` ${d.eventDescription} ${d3.timeFormat("%A, %e %B")(d.date)}`)
        .attr("x", width);
      // .text(([d]) => d.eventName);
  
  const tooltip = d3.create("div")
    .attr("class", "tooltip")
    .attr("aria-hidden", "true")
    .html(`
      <div class="tooltip-date">
        <span id="date"></span>
      </div>
      <div class="tooltip-name">
        <span id="name"></span>
      </div>
      <div class="tooltip-description">
        <span id="description"></span>
      </div>
    `);
  
  const rangeY = dodgedYValues.map(x => x + params.plot.y); 
  const rangeY0 = rangeY[0];
  const fuzzyTextHeightAdjustment = 16
  
  svg.on("touchend mouseout", function(event) {
    markers
      .attr("fill", d => d.sharedOrPersonal === "Holocaust" ? markerDefaultColor : markerPersonalColor)
      .attr("stroke", d => d.sharedOrPersonal === "Holocaust" ? markerDefaultColor : markerPersonalColor);
    
    eventLabels
      .style("opacity", 1);
  });
  
  svg.on("touchmove mousemove", function(event) {
    const mouseY = d3.pointer(event,this)[1];
    const nearestEventY = rangeY.reduce((a, b) => Math.abs(b - mouseY) < Math.abs(a - mouseY) ? b : a);
    const dodgedIndex = rangeY.indexOf(nearestEventY);
    const dataEvent = data[dodgedIndex];

    if (mouseY >= rangeY0 - fuzzyTextHeightAdjustment) {

      eventLabels
        .filter((d, i) => i !== dodgedIndex)
        .style("opacity", 0.3);

      eventLabels
        .filter((d, i) => i === dodgedIndex)
        .style("opacity", 1);

      markers
        .filter((d, i) => i !== dodgedIndex)
        .attr("fill", markerFadedColor)
        .attr("stroke", markerFadedColor);

      markers
        .filter((d, i) => i === dodgedIndex)
        .attr("fill", d => d.sharedOrPersonal === "Holocaust" ? markerDefaultColor : markerPersonalColor)
        .attr("stroke", d => d.sharedOrPersonal === "Holocaust" ? markerDefaultColor : markerPersonalColor)
        .raise();
      
      tooltip.style("opacity", 1);
      tooltip.style("transform", `translate(${(width >= params.smallScreenSize ? params.plot.x + 8 : 0)}px, calc(-100% + ${nearestEventY}px))`);
      tooltip.select("#date")
        .text(d3.timeFormat("%A, %e %B")(dataEvent.date));
      tooltip.select("#name")
        .text(dataEvent.eventName);
      tooltip.select("#description")
        .text(dataEvent.eventDescription);
    }
  });

  svg.on("touchend mouseleave", () => tooltip.style("opacity", 0));

  return html`
    <figure style="max-width: 100%;">
      <div id="wrapper" class="wrapper">
        ${tooltip.node()}
        ${svg.node()}
      </div>
    </figure>
  </div>`;
  
  // return svg.node();
  // yield svg.node();
  // d3.selectAll(".event-name div").attr('class', 'teft');
}
//This handles the spacing between events on the timeline, for the text at least. 35 is the most appealing to me.
viewof labelSeparation = slider({
  min: 12, 
  max: 48,
  step: 2, 
  value: 35, 
  title: "Label separation",
})
lockdownData = [
  //changed "Lockdown 1.0" to "Holocaust"
  //changed startDate from 'new Date("2020", "2", "24", "6")' to 'new Date("1933", "1", "24", "6")'
  {name: "Holocaust", startDate: new Date("1933", "1", "1", "6"), endDate: new Date("1945", "11", "31", "6"), description: "When social distancing began, we didn’t know much about the virus, such as how it spread or what precautions to take.\nIt was a difficult time."}, // zero-indexed month means "3" is March and "11" is December
  // {name: "Lockdown 2.0", startDate: new Date("2020", "6", "9", "6"), endDate: new Date("2020", "9", "28", "6"), description: "The second time around was easier and harder. We knew the drill, routines were easier, but we’d burnt through a lot more of our reserves.\nIt was 110 days."}, // zero-indexed month means "6" is Jul and "9" is October
  // {name: "Ring of Steel", startDate: new Date("2020", "9", "28", "6"), endDate: new Date("2020", "10", "8", "6"), description: "We continued to be trapped in Melbourne for another two weeks after lockdown “ended”."}, // zero-indexed month means "9" is October and "10" is November
]
mdDataTable = md`## Data table`
 // accessibleDataTable = render_data_table(dataCSV, {caption: "This data shows Holocaust events.", columns: ["Date", "Country", "Event", "Event description", "Personal or Shared"], focusable: false})
render_data_table = (data, options = {}) => {
  
  let caption = "";
  let ariaLabelledbyCaption = "";
  if (options.caption) {
    caption = `<caption id="caption">${options.caption}</caption>`;
    ariaLabelledbyCaption = `aria-labelledby="caption"`;
  }
  
  let theadRowHeaderCells;
  if (options.columns) {
    theadRowHeaderCells = options.columns.map((d) => {
      return `<th scope="col">${d}</th>`
    });
  }
  else {
    theadRowHeaderCells = Object.keys(data[0]).map((d, i) => {
      return `<th scope="col">${d}</th>`
    });
  }
  
  let focusable = 'tabindex="0"';
  if (options.focusable === false) {
    focusable = '';
  }
  
  return html`
  <div class="table-container" ${focusable} role="group" ${ariaLabelledbyCaption}>  
    <table>
      ${caption}
      <thead>
        <tr>${theadRowHeaderCells}</tr>
      <thead>
      <tbody>
        ${data.map(row => {
          return html`<tr>${Object.values(row).map((col, index) => {
            return index === 0 ? `<td>${d3.timeFormat("%A, %e %B")(col)}</td>`: `<td>${col}</td>`;
          })}</tr>`;
        })}
      </tbody>
    </table>
  </div>
`}
data = sourceData.filter(d => {
  if (eventsSelection === "Holocaust") { return d.sharedOrPersonal === "Holocaust"; }
  else if (eventsSelection === "Japanese") { return d.sharedOrPersonal === "Japanese"; }
  else { return true };
})
csvText = FileAttachment("spacingField@3.csv").text()
sourceData = {
  const timeParser = d3.timeParse("%d-%b-%y"); // day-abbrevmonth-year w/o century // this isn't the right date format
  const csvString = csvText;// csv;
  const rowConversionFunction = ({
        "Date": date,
        "Country": country,
        "Event": eventName,
        "Description": eventDescription,
        "SharedOrPersonal": sharedOrPersonal
      }) => ({
        date: new window.Date(date),//timeParser(date), // adjusting to 6AM instead of midnight aligns first of month circles with axis tick markers
        country,
        eventName, 
        eventDescription,
        sharedOrPersonal
      });
  return d3.csvParse(csvString, rowConversionFunction);

  // const extraPropertiesSource = {
  //   title: "My 2020 timeline",
  //   subtitle: "One Aussie's story"
  // };
  // return Object.assign(dataObjectTarget, extraPropertiesSource);
}
## Timeline
// The dodge function takes an array of positions (e.g. X values along an X Axis) in floating point numbers
// The dodge function optionally takes customisable separation, iteration, and error values.
// The dodge function returns a similar array of positions, but slightly dodged from where they were in an attempt to separate them out. It restrains the result a little bit so that the elements don't explode all over the place and so they don't go out of bounds.

//deals with the labels of the events
function dodge(positions, separation = 10, maxiter = 10, maxerror = 1e-1) { 
  positions = Array.from(positions);
  let n = positions.length;
  if (!positions.every(isFinite)) throw new Error("invalid position");
  if (!(n > 1)) return positions;
  let index = d3.range(positions.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    index.sort((i, j) => d3.ascending(positions[i], positions[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = positions[index[i]] - positions[index[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        positions[index[i - 1]] -= delta;
        positions[index[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return positions;
}
//deals with the labels of the events
y = d3.scaleUtc()
  .domain(d3.extent(dataCSV, d => d.date)).nice()
  .range([params.plot.y , params.plot.height]);
//This handles the main 'axis' of the timeline (not the events, just the years)
axis = {
  //TODO (Vanessa): How can I change this so that years with less data have less space than years with more data? Also, years with more data should be a little bigger so can spread points out.
  const yAxis = width >= params.smallScreenSize ? 
        d3.axisRight(y)
            .tickPadding(-(params.margin.axisLeft)) //pads between the year and the axis
            .tickSizeOuter(0) //tried changing to 10, nothing happened
            .tickSizeInner(-(params.margin.axisLeft)) //the tick line that connects year to the axis
        :
        d3.axisRight(y)
            .tickPadding(-(params.smallScreenMargin.axisLeft))
            .tickSizeOuter(0)
            .tickSizeInner(-(params.smallScreenMargin.axisLeft))
            .tickFormat(d3.timeFormat('%b')); //displays only year

  return {y: yAxis};
}
//I believe that params deals with everything except the circles for events. Except for the line that changes the size of the marker.
params = {
  let output = {};
  
  output["smallScreenSize"] = 768;
  output["mediumScreenSize"] = 940;
  
  output["svg"] = {
    "width":  width,
    //changed data.length to dataCSV.length
    // Roughly relative to number of data points but doesn't factor in the full timeline scale such as clustering or spread out data. 
    "height": dataCSV.length * 50 //by changing to 80+ the points are more spread out but when looking at Holocaust OR Japanese internment     it almost seems too spread out 
  };
  
  output["margin"] = {
    "top":    104,
    "right":  96,
    "bottom": 192,
    "left":   240,
    "axisLeft": 144,
  };
  
  output["plot"] = {
    "x":      output["margin"]["left"],
    "y":      output["margin"]["top"],
    "width":  output["svg"]["width"]  - output["margin"]["left"] - output["margin"]["right"],
    "height": output["svg"]["height"] - output["margin"]["top"]  - output["margin"]["bottom"]
  };
  
  output["smallScreenMargin"] = {
    "top":    60,
    "right":  8,
    "bottom": 192,
    "left":   8,
    "axisLeft": 144,
  };

  output["smallScreenPlot"] = {
    "x":      output["margin"]["left"],
    "y":      output["margin"]["top"],
    "width":  output["svg"]["width"]  - output["margin"]["left"] - output["margin"]["right"],
    "height": output["svg"]["height"] - output["margin"]["top"]  - output["margin"]["bottom"]
  };

  //changes the size of the event circle, was originally 4, I changed to 3
  output["marker"] = {
    "radius": 3
  }

  //dont see a difference between *2 or *200 so I don't know what this does
  output["date"] = {
    "offset": output["marker"]["radius"] * 20000
  }

  //moves labels to the right
  output["event"] = {
    "offset": output["marker"]["radius"] * 6
  }

  //dont see a difference between *4 or * 400 so I don't know what this doe
  output["smallScreenEvent"] = {
    "offset": output["marker"]["radius"] * 4
  }
  
  return output;
}
function halo(text) {
  text.clone(true)
      .each(function() { this.parentNode.insertBefore(this, this.previousSibling); })
      .attr("aria-hidden", "true")
      .attr("fill", "none")
      .attr("stroke", backgroundColor)
      .attr("stroke-width", 24)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .style("text-shadow", `-1px -1px 2px ${backgroundColor}, 1px 1px 2px ${backgroundColor}, -1px 1px 2px ${backgroundColor}, 1px -1px 2px ${backgroundColor}`);
}
import {radio} from "@jashkenas/inputs"
import {text} from "@jashkenas/inputs"
import {slider} from "@jashkenas/inputs"
## Maps
height = 610
width = 975
tooltip = d3.select("body").append("div").attr("class", "svg-tooltip")
holocaustCampsChart = {
  var margin = {top: 50, right: 80, bottom: 50, left: 80};

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);
  
  svg.append("path")
    .attr("fill", "#ddd")
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(europe, europe, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", countriesPath);
  
  // peak population
  svg.append("g")
    .selectAll("circle")
    // note: Chelmno appears twice in dataset due to 2 time periods of opening
    .data(concentrationCamps
       .filter(d => d.position)
       .sort((a, b) => d3.descending(a.peak_population, b.peak_population)))
    .join("circle")
      .attr("transform", d => `translate(${holocaustCampsProjection(d.position)})`)  
      .attr("r", d => holocoaustCampsRadius(d.peak_population))
      .attr("fill", function(d) {
        if (d.peak_population) {
          return "#9880C2";
        } else {
          return "white";
        }
      })
      .attr("stroke", "#9880C2")
      .attr("fill-opacity", 0.6)
  
  // deaths instead of peak population: circles are much bigger, not sure if it matches well with the other map
  // svg.append("g")
  //   .selectAll("circle")
  //   .data(concentrationCamps
  //      .filter(d => d.position)
  //      .sort((a, b) => d3.descending(a.deaths, b.deaths)))
  //   .join("circle")
      // .attr("transform", d => `translate(${holocaustCampsProjection(d.position)})`)  
      // .attr("r", d => holocoaustCampsRadius(d.peak_population))
  //     .attr("fill", function(d) {
  //       if (d.deaths) {
  //         return "#9880C2";
  //       } else {
  //         return "white";
  //       }
  //     })
  //     .attr("stroke", "#9880C2")
  //     .attr("fill-opacity", 0.6)
  
  svg.selectAll("circle")
    .on('mouseover', function(evt, d) {
      d3.select(this).attr('stroke-width', 5);
    })
    .on('mousemove', function(event, d) {
      tooltip.style("left", event.pageX + 18 + "px")
        .style("top", event.pageY - 18 + "px")
        .style("display", "block")
        .html(`<strong>${d.name}</strong>
              <p>${d.location}</p>
              <p>Peak: ${d.peak_population ? d.peak_population : "n/a"}</p>
              <p>Approx. deaths: ${d.deaths ? d.deaths : "n/a"}</p>`);
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-width', 1);
      tooltip.style("display", "none"); // Hide toolTip
    });

  const mapTitleBox = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", margin.top + 15)
    .attr("fill", "white")
    // .attr("opacity", "60%")

    const chartTitle = svg.append("g")
    .attr("class", "chart-title")
    .append("text")
      .attr("id", "title-text")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", margin.top)
      .style("font-weight", "700")
      .style("font-size", "clamp(1.2rem, 4vw, 2.5rem)") // minimum, preferred, maximum
      .text("Peak Population in Holocaust Concentration Camps");
      // .text("Deaths in Holocaust Concentration Camps");
  
  // const noteBox = svg.append("rect")
  //   .attr("x", 0)
  //   .attr("y", height - 32)
  //   .attr("width", width)
  //   .attr("height", 32)
  //   .attr("fill", "white")
  //   // .attr("opacity", "60%")
  
  // const note = svg.append("text")
  //   .attr("x", 10)
  //   .attr("y", height - 10)
  //   .text("Due to a lack of records on number of people in the camps, many of these values are unknown.")

  return svg.node();
}
internmentCampsChart = {
  var margin = {top: 50, right: 100, bottom: 50, left: 100};
  
  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width+margin.left+margin.right, height+margin.top+margin.bottom]); 

  const chartTitle = svg.append("g")
    .attr("class", "chart-title")
    .append("text")
      .attr("id", "title-text")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .style("font-weight", "700")
      .style("font-size", "clamp(1.2rem, 4vw, 2.5rem)") // minimum, preferred, maximum
      .text("Peak Population in Japanese Internment Camps");

  // country land map
  svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#ddd")
      .attr("d", internmentCampsPath);

  // state borders
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", internmentCampsPath);

  // todos: 
  // sort so smaller circles on top? - some of the smaller circle aren't drawn on top
  const circles = svg.append("g")
    .selectAll("circle")
    .data(internmentCamps
       .filter(d => d.position)
       .sort((a, b) => d3.descending(a.peak_population, b.peak_population)))
    .join("circle")
      .attr("id", "circle")
      .attr("transform", d => `translate(${internmentCampsProjection(d.position)})`)  
      .attr("r", d => internmentCampsRadius(d.peak_population)) // size encoding // todo: try color encoding instead of size
      // .attr("r", d => d.peak_population ? 10 : 8) // no size encoding
      .attr("fill", function(d) {
        if (d.peak_population) {
          return "#5598E2";
        } else {
          return "white";
        }
      })
      .attr("stroke", "#5598E2")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.5);

  svg.selectAll("circle")
    .on('mouseover', function(event, d) {
      d3.select(this).attr('stroke-width', 5);     
    })
    .on('mousemove', function(event, d) {
      tooltip.style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 15 + "px")
        .style("display", "block")
        .html(`<strong>${d.name}</strong>
              <p>${d.location}</p>
              <p>Peak: ${d.peak_population ? d.peak_population : "n/a"}</p>`);
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-width', 1);
      tooltip.style("display", "none"); // Hide toolTip
    });
  
  return svg.node();
}
holocoaustCampsRadius = d3.scaleSqrt([0, d3.max(concentrationCamps, d => d.peak_population)], [10, 50])
holocaustCampsProjection = d3.geoMercator()
  .center([0, 0])
  .translate([70, 2100])  // .translate([256, 256])  // .translate([500, 500]);
  .scale(1650)  // .scale(512 / (2 * Math.PI))  // .scale(960/Math.PI/2)
path = d3.geoPath(holocaustCampsProjection)(land)
countriesPath = d3.geoPath(holocaustCampsProjection)(europe)
internmentCampsRadius = d3.scaleSqrt([0, d3.max(internmentCamps, d => d.peak_population)], [7, 9])
internmentCampsPath = d3.geoPath()
internmentCampsProjection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
holocaustCampsURL = FileAttachment("concentration_camp_locations.csv").url()
concentrationCamps = d3.csv(holocaustCampsURL,(({name, facility_type, location, latitude, longitude, date_opened, date_closed, location_descr, peak_population, people_died, date_peak, link, link2}) => ({
  name: name,
  facility_type: facility_type,
  location: location,
  'position': [longitude, latitude],
  // location_descr: location_descr,
  peak_population: +peak_population,
  deaths: +people_died,
  link: link,
  link2: link2,
  'Date opened': new Date(date_opened),
  'Date closed': new Date(date_closed),
  'Date peak': new Date(date_peak),  
})))
internmentCampsURL = FileAttachment("internment_camp_locations.csv").url()
internmentCamps = d3.csv(internmentCampsURL,(({name, facility_type, abbrev_location, latitude, longitude, date_opened, date_closed, location_descr, peak_population, date_peak, link, link2}) => ({
  name: name,
  facility_type: facility_type,
  location: abbrev_location,
  longitude: longitude,
  latitude: latitude,
  'position': [longitude, latitude],
  // location_descr: location_descr,
  peak_population: peak_population,
  link: link,
  link2: link2,
  'Date opened': new Date(date_opened),
  'Date closed': new Date(date_closed),
  'Date peak': new Date(date_peak),  
})))
// Holocaust
land = FileAttachment("land-50m.json").json()
   .then(topology => topojson.feature(topology, topology.objects.land))
// Holocaust
europe = FileAttachment("europe-holocaust-50m.json").json()
// Japanese
us = FileAttachment("counties-albers-10m.json").json()
import {projectionInput} from "@d3/projection-comparison"
import {map} with {projection} from "@d3/world-map"
topojson = require("topojson-client@3")
## Styling
backgroundColor = "#FAF9FB"; // for the timeline
// timeline
chartStyles = html`<style>
  #chart-background {
    fill: ${backgroundColor};
  }

  .tick line,
  .domain {
    stroke: #E2E0E5;
  }
`
// timeline
typographyStyles = html`<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700;900&display=swap');

text {
  fill: #3C3941;
  font: 400 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
}

.event-title {
  fill: #3C3941;
  font-size: 16px;
  line-height: 1.4;
  font-family: "Source Sans Pro", "Noto Sans", sans-serif;
}

.event-title:hover {
  cursor: default;
}

.event-description {
  fill: #3C3941;
  font: 400 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
  transform: translateY(1em);
}

#title {
  fill: #3C3941;
  font: 600 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
}

.axis text {
  font: 400 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
  fill: #676170;
}

@media (max-width: ${params.smallScreenSize}px) {
  text,
  .event-title,
  .event-description,
  #title,
  .axis text {
    font-size: 14px;
  }
}

</style>
`
// timeline
tooltipStyles = html`
<style>
  .wrapper {
    position: relative;
  }

  .tooltip {
    background-color: #fff;
    border: 1px solid #5F428F;
    font-family: "Source Sans Pro", "Noto Sans", sans-serif;
    left: 0;
    max-width: 300px;
    opacity: 0;
    padding: calc(16px - 1px); /* border width adjustment */
    pointer-events: none;
    border-radius: 5px;
    position: absolute;
    top: -8px;
    transition: opacity 0.1s linear, transform 0.05s ease-in-out;
    z-index: 1;
  }

/*
  .tooltip:before {
    background-color: #fff;
    border-left-color: transparent;
    border-top-color: transparent;
    bottom: 0;
    content: '';
    height: 12px;
    left: 50%;
    position: absolute;
    transform-origin: center center;
    transform: translate(-50%, 50%) rotate(45deg);
    width: 12px;
    z-index: 1;
  }
*/

  .tooltip-date {
    margin-bottom: 0.2em;
    font-size: 0.7em;
    line-height: 1.2;
    font-weight: 400;
  }

  .tooltip-name {
    margin-bottom: 0.2em;
    font-size: 1em;
    line-height: 1.4;
    font-weight: 700;
  }

  .tooltip-description {
    margin-bottom: 0.2em;
    font-size: 0.8em;
    line-height: 1.4;
    font-weight: 400;
  }
</style>
`
// maps
styles = html`
  <style>
  .svg-tooltip {
    position: absolute;
    display: none;
    min-width: 30px;
    // max-width: 240px;
    border-radius: 4px;
    height: auto;
    background: rgba(250,250,250, 0.9);    // background: rgba(69,77,93,.9);
    border: 1px solid #DDD;
    padding: 12px 8px 0px 8px; // 8px;
    font-size: .85rem;
    text-align: left;
    z-index: 1000;    
    font-family: "Source Sans Pro", "Noto Sans", sans-serif;
    line-height: 30%; //80%;
  }

  .svg-tooltip p {
    margin: 0 2 0 2;
  }

</style>`
// d3 = require("d3@6", "d3-textwrap")
d3 = require("d3@7", "d3-array@3", "d3-geo@3", "d3-geo-projection@4")
