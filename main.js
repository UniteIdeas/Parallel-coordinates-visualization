window.onload = function () {
    "use strict";

    // INITIAL SETUP
    var margin = {
            top: 50,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangePoints([0, width], 1);

    var line = d3.svg.line(),
        axis = d3.svg.axis()
        .orient("left"),
        foreground;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data, goals = {
            'Goal 1. Eradicate extreme poverty and hunger': ['Population below national poverty line, rural, %', 'Population below national poverty line, total, %', 'Population below national poverty line, urban, %', 'Growth rate of GDP per person employed, %', 'Employment-to-population ratio, both sexes, %', 'Employment-to-population ratio, men, %', 'Employment-to-population ratio, women, %', 'Youth unemployment rate, aged 15-24, both sexes', 'Youth unemployment rate, aged 15-24, men', 'Youth unemployment rate, aged 15-24, women', 'Share of youth unemployed to total unemployed, both sexes', 'Share of youth unemployed to total unemployed, men', 'Share of youth unemployed to total unemployed, women', 'Share of youth unemployed to youth population, both sexes', 'Share of youth unemployed to youth population, men', 'Share of youth unemployed to youth population, women', 'Ratio of youth unemployment rate to adult unemployment rate, both sexes', 'Ratio of youth unemployment rate to adult unemployment rate, men', 'Ratio of youth unemployment rate to adult unemployment rate, women', 'Population undernourished, millions', 'Population undernourished, %', 'Children under 5 moderately or severely underweight, %', 'Proportion of own-account and contributing family workers in total employment, both sexes, %', 'Proportion of own-account and contributing family workers in total employment, men, %', 'Proportion of own-account and contributing family workers in total employment, women, %'],
            'Goal 2. Achieve universal primary education': ['Literacy rates of 15-24 years old, both sexes, %', 'Literacy rates of 15-24 years old, men, %', 'Literacy rates of 15-24 years old, women, %', 'Primary completion rate, both sexes', 'Primary completion rate, boys', 'Primary completion rate, girls', 'Total net enrolment ratio in primary education, both sexes', 'Total net enrolment ratio in primary education, boys', 'Total net enrolment ratio in primary education, girls', '% of pupils starting grade 1 who reach last grade of primary, both sexes', '% of pupils starting grade 1 who reach last grade of primary, boys', '% of pupils starting grade 1 who reach last grade of primary, girls', 'Women to men parity index, as ratio of literacy rates, 15-24 years old'],
            'Goal 3. Promote gender equality and empower women': ['Seats held by men in national parliament', 'Seats held by women in national parliament', 'Seats held by women in national parliament, %', 'Total number of seats in national parliament', 'Gender Parity Index in primary level enrolment', 'Gender Parity Index in secondary level enrolment', 'Gender Parity Index in tertiary level enrolment', 'Share of women in wage employment in the non-agricultural sector'],
            'Goal 4. Reduce child mortality': ['Infant mortality rate (0-1 year) per 1,000 live births', 'Children 1 year old immunized against measles, %', 'Children under five mortality rate per 1,000 live births'],
            'Goal 5. Improve maternal health': ['Maternal mortality ratio per 100,000 live births', 'Births attended by skilled health personnel, %', 'Unmet need for family planning, limiting, %', 'Unmet need for family planning, spacing, %', 'Unmet need for family planning, total, %', 'Current contraceptive use among married women 15-49 years old, any method, %', 'Current contraceptive use among married women 15-49 years old, condom, %', 'Current contraceptive use among married women 15-49 years old, modern methods, %', 'Adolescent birth rate, per 1,000 women', 'Antenatal care coverage, at least four visits, %', 'Antenatal care coverage, at least one visit, %'],
            'Goal 6. Combat HIV/AIDS, malaria and other diseases': ['AIDS deaths', 'AIDS deaths (lower bound)', 'AIDS deaths (upper bound)', 'AIDS orphans (one or both parents)', 'Condom use at last high-risk sex, 15-24 years old, men, %', 'Condom use at last high-risk sex, 15-24 years old, women, %', 'Condom use to overall contraceptive use among currently married women 15-49 years old, %', 'People living with HIV, 15-49 years old, %', 'People living with HIV, 15-49 years old, % (lower bound)', 'People living with HIV, 15-49 years old, % (upper bound)', 'HIV incidence rate, 15-49 years old, % (lower bound)', 'HIV incidence rate, 15-49 years old, % (mid-point)', 'HIV incidence rate, 15-49 years old, % (upper bound)', 'School attendance rate of children aged 10-14 both of whose parents are alive and who live with at least one parent', 'School attendance rate of orphans aged 10-14', 'Tuberculosis death rate per year per 100,000 population (lower bound)', 'Tuberculosis death rate per year per 100,000 population (mid-point)', 'Tuberculosis death rate per year per 100,000 population (upper bound)', 'Tuberculosis detection rate under DOTS, % (lower bound)', 'Tuberculosis detection rate under DOTS, % (mid-point)', 'Tuberculosis detection rate under DOTS, % (upper bound)', 'Tuberculosis incidence rate per year per 100,000 population (lower bound)', 'Tuberculosis incidence rate per year per 100,000 population (mid-point)', 'Tuberculosis incidence rate per year per 100,000 population (upper bound)', 'Tuberculosis prevalence rate per 100,000 population (lower bound)', 'Tuberculosis prevalence rate per 100,000 population (mid-point)', 'Tuberculosis prevalence rate per 100,000 population (upper bound)', 'Men 15-24 years old with comprehensive correct knowledge of HIV/AIDS, %', 'Women 15-24 years old with comprehensive correct knowledge of HIV/AIDS, %', 'Ratio of school attendance rate of orphans to school attendance rate of non orphans', 'Children under 5 sleeping under insecticide-treated bed nets, %', 'Children under 5 with fever being treated with anti-malarial drugs, %'],
            'Goal 7. Ensure environmental sustainability': ['Consumption of all Ozone-Depleting Substances in ODP metric tons', 'Proportion of the population using improved drinking water sources, rural', 'Proportion of the population using improved drinking water sources, total', 'Proportion of the population using improved drinking water sources, urban', 'Proportion of the population using improved sanitation facilities, rural', 'Proportion of the population using improved sanitation facilities, total', 'Proportion of the population using improved sanitation facilities, urban'],
            'Goal 8. Develop a global partnership for development': ['Net ODA as % of OECD/DAC donors GNI', 'Net ODA to LDCs as % of OECD/DAC donors GNI', 'Net ODA to LDCs, million US$', 'Net ODA, million US$', 'ODA provided to help build trade capacity, %', 'ODA received in landlocked developing countries as % of their GNI', 'ODA received in landlocked developing countries, million US$', 'ODA received in small islands developing States as % of their GNI', 'ODA received in small islands developing States, million US$', 'ODA that is untied, million US$', 'ODA that is untied, %', 'ODA to basic social services as % of sector-allocable ODA', 'ODA to basic social services, million US$', 'Developed country imports from the LDCs, admitted duty free, %', 'Agriculture support estimate for OECD countries as % of their GDP', 'Agriculture support estimate for OECD countries, million US$', 'Debt relief committed under HIPC initiative, cumulative million US$ in end-2009 NPV terms', 'Debt relief delivered in full under MDRI initiative, cumulative million US$ in end-2009 NPV terms', 'Debt service as % of exports of goods and services and net income', 'Fixed-telephone subscriptions', 'Fixed-telephone subscriptions per 100 inhabitants', 'Mobile-cellular subscriptions', 'Mobile-cellular subscriptions per 100 inhabitants', 'Internet users per 100 inhabitants']
        },
        ranges = {
            "Adolescent birth rate, per 1,000 women": [0, 150],
            "Agriculture support estimate for OECD countries as % of their GDP": [0, 2.1],
            "Agriculture support estimate for OECD countries, million US$": [0, 131200],
            "AIDS deaths": [0, 250000],
            "AIDS deaths (lower bound)": [0, 250000],
            "AIDS deaths (upper bound)": [0, 250000],
            "AIDS orphans (one or both parents)": [0, 2500000],
            "Antenatal care coverage, at least four visits, %": [0, 100],
            "Antenatal care coverage, at least one visit, %": [0, 100],
            "Births attended by skilled health personnel, %": [0, 100],
            "Children 1 year old immunized against measles, %": [0, 100],
            "Children under 5 moderately or severely underweight, %": [0, 100],
            "Children under 5 sleeping under insecticide-treated bed nets, %": [0, 100],
            "Children under 5 with fever being treated with anti-malarial drugs, %": [0, 100],
            "Children under five mortality rate per 1,000 live births": [0, 200],
            "Condom use at last high-risk sex, 15-24 years old, men, %": [0, 100],
            "Condom use at last high-risk sex, 15-24 years old, women, %": [0, 100],
            "Condom use to overall contraceptive use among currently married women 15-49 years old, %": [0, 100],
            "Consumption of all Ozone-Depleting Substances in ODP metric tons": [0, 16000],
            "Current contraceptive use among married women 15-49 years old, any method, %": [0, 100],
            "Current contraceptive use among married women 15-49 years old, condom, %": [0, 100],
            "Current contraceptive use among married women 15-49 years old, modern methods, %": [0, 100],
            "Debt relief committed under HIPC initiative, cumulative million US$ in end-2009 NPV terms": [0, 10000],
            "Debt relief delivered in full under MDRI initiative, cumulative million US$ in end-2009 NPV terms": [0, 3200],
            "Debt service as % of exports of goods and services and net income": [0, 100],
            "Developed country imports from the LDCs, admitted duty free, %": [0, 100],
            "Employment-to-population ratio, both sexes, %": [0, 100],
            "Employment-to-population ratio, men, %": [0, 100],
            "Employment-to-population ratio, women, %": [0, 100],
            "Fixed-telephone subscriptions": [0, 300000000],
            "Fixed-telephone subscriptions per 100 inhabitants": [0, 130],
            "Gender Parity Index in primary level enrolment": [0, 7],
            "Gender Parity Index in secondary level enrolment": [0, 7],
            "Gender Parity Index in tertiary level enrolment": [0, 7],
            "Growth rate of GDP per person employed, %": [-17, 17],
            "HIV incidence rate, 15-49 years old, % (lower bound)": [0, 3],
            "HIV incidence rate, 15-49 years old, % (mid-point)": [0, 3],
            "HIV incidence rate, 15-49 years old, % (upper bound)": [0, 3],
            "Infant mortality rate (0-1 year) per 1,000 live births": [0, 110],
            "Internet users per 100 inhabitants": [0, 100],
            "Literacy rates of 15-24 years old, both sexes, %": [0, 100],
            "Literacy rates of 15-24 years old, men, %": [0, 100],
            "Literacy rates of 15-24 years old, women, %": [0, 100],
            "Maternal mortality ratio per 100,000 live births": [0, 1100],
            "Men 15-24 years old with comprehensive correct knowledge of HIV/AIDS, %": [0, 100],
            "Mobile-cellular subscriptions": [0, 1300000000],
            "Mobile-cellular subscriptions per 100 inhabitants": [0, 310],
            "Net ODA as % of OECD/DAC donors GNI": [0, 1.2],
            "Net ODA to LDCs as % of OECD/DAC donors GNI": [0, 1.2],
            "Net ODA to LDCs, million US$": [0, 105000],
            "Net ODA, million US$": [0, 32000],
            "ODA provided to help build trade capacity, %": [0, 100],
            "ODA received in landlocked developing countries as % of their GNI": [0, 100],
            "ODA received in landlocked developing countries, million US$": [0, 5500],
            "ODA received in small islands developing States as % of their GNI": [0, 100],
            "ODA received in small islands developing States, million US$": [0, 1200],
            "ODA that is untied, million US$": [0, 17000],
            "ODA that is untied, %": [0, 100],
            "ODA to basic social services as % of sector-allocable ODA": [0, 100],
            "ODA to basic social services, million US$": [0, 8000],
            "People living with HIV, 15-49 years old, %": [0, 100],
            "People living with HIV, 15-49 years old, % (lower bound)": [0, 30],
            "People living with HIV, 15-49 years old, % (upper bound)": [0, 30],
            "% of pupils starting grade 1 who reach last grade of primary, both sexes": [0, 100],
            "% of pupils starting grade 1 who reach last grade of primary, boys": [0, 100],
            "% of pupils starting grade 1 who reach last grade of primary, girls": [0, 100],
            "Population below national poverty line, rural, %": [0, 100],
            "Population below national poverty line, total, %": [0, 100],
            "Population below national poverty line, urban, %": [0, 100],
            "Population undernourished, millions": [0, 200],
            "Population undernourished, %": [0, 100],
            "Primary completion rate, both sexes": [0, 120],
            "Primary completion rate, boys": [0, 120],
            "Primary completion rate, girls": [0, 120],
            "Proportion of own-account and contributing family workers in total employment, both sexes, %": [0, 100],
            "Proportion of own-account and contributing family workers in total employment, men, %": [0, 100],
            "Proportion of own-account and contributing family workers in total employment, women, %": [0, 100],
            "Proportion of the population using improved drinking water sources, rural": [0, 100],
            "Proportion of the population using improved drinking water sources, total": [0, 100],
            "Proportion of the population using improved drinking water sources, urban": [0, 100],
            "Proportion of the population using improved sanitation facilities, rural": [0, 100],
            "Proportion of the population using improved sanitation facilities, total": [0, 100],
            "Proportion of the population using improved sanitation facilities, urban": [0, 100],
            "Ratio of school attendance rate of orphans to school attendance rate of non orphans": [0, 1.25],
            "Ratio of youth unemployment rate to adult unemployment rate, both sexes": [0, 20],
            "Ratio of youth unemployment rate to adult unemployment rate, men": [0, 20],
            "Ratio of youth unemployment rate to adult unemployment rate, women": [0, 20],
            "School attendance rate of children aged 10-14 both of whose parents are alive and who live with at least one parent": [50, 100],
            "School attendance rate of orphans aged 10-14": [50, 100],
            "Seats held by men in national parliament": [0, 600],
            "Seats held by women in national parliament": [0, 600],
            "Seats held by women in national parliament, %": [0, 100],
            "Share of women in wage employment in the non-agricultural sector": [0, 100],
            "Share of youth unemployed to total unemployed, both sexes": [0, 100],
            "Share of youth unemployed to total unemployed, men": [0, 100],
            "Share of youth unemployed to total unemployed, women": [0, 100],
            "Share of youth unemployed to youth population, both sexes": [0, 100],
            "Share of youth unemployed to youth population, men": [0, 100],
            "Share of youth unemployed to youth population, women": [0, 100],
            "Total net enrolment ratio in primary education, both sexes": [0, 100],
            "Total net enrolment ratio in primary education, boys": [0, 100],
            "Total net enrolment ratio in primary education, girls": [0, 100],
            "Total number of seats in national parliament": [0, 700],
            "Tuberculosis death rate per year per 100,000 population (lower bound)": [0, 200],
            "Tuberculosis death rate per year per 100,000 population (mid-point)": [0, 200],
            "Tuberculosis death rate per year per 100,000 population (upper bound)": [0, 200],
            "Tuberculosis detection rate under DOTS, % (lower bound)": [0, 200],
            "Tuberculosis detection rate under DOTS, % (mid-point)": [0, 200],
            "Tuberculosis detection rate under DOTS, % (upper bound)": [0, 100],
            "Tuberculosis incidence rate per year per 100,000 population (lower bound)": [0, 1600],
            "Tuberculosis incidence rate per year per 100,000 population (mid-point)": [0, 1600],
            "Tuberculosis incidence rate per year per 100,000 population (upper bound)": [0, 1600],
            "Tuberculosis prevalence rate per 100,000 population (lower bound)": [0, 1500],
            "Tuberculosis prevalence rate per 100,000 population (mid-point)": [0, 1500],
            "Tuberculosis prevalence rate per 100,000 population (upper bound)": [0, 1500],
            "Unmet need for family planning, limiting, %": [0, 100],
            "Unmet need for family planning, spacing, %": [0, 100],
            "Unmet need for family planning, total, %": [0, 100],
            "Women 15-24 years old with comprehensive correct knowledge of HIV/AIDS, %": [0, 100],
            "Women to men parity index, as ratio of literacy rates, 15-24 years old": [0.9, 1.1],
            "Youth unemployment rate, aged 15-24, both sexes": [0, 100],
            "Youth unemployment rate, aged 15-24, men": [0, 100],
            "Youth unemployment rate, aged 15-24, women": [0, 100]
        },
        initialDimensions = ['Maternal mortality ratio per 100,000 live births', 'Mobile-cellular subscriptions per 100 inhabitants', 'Tuberculosis death rate per year per 100,000 population (mid-point)', 'Seats held by women in national parliament, %', 'Children 1 year old immunized against measles, %', 'Population undernourished, %'];

    // Create scale for each measure
    initialDimensions.sort();
    d3.keys(ranges)
        .map(function (name) {
            ranges[name] = d3.scale
                .linear()
                .domain([ranges[name][0], ranges[name][1]])
                .range([height, 0]);
        });

    // Define function that will perform edge bundling
    var bundleEdges = function (nodes, edges, index, callback) {
        if (window.Worker) {
            // Use web worker to perform edge bundling
            var worker = new Worker("worker.js");
            worker.postMessage({
                nodes: nodes,
                edges: edges
            });
            worker.onmessage = function (e) {
                callback(e.data, index);
            }
        } else {
            var fbundling = d3.ForceEdgeBundling()
                .nodes(nodes)
                .edges(edges)
                .step_size(0.02)
                .iterations(30);
            var bundlingResults = fbundling();
            callback(bundlingResults, index);
        }
    }

    // Perform edge bundling on all sections of the parallel coordinates a
    // and organize results in meaningfull way
    var prepareLines = function (data, dimensions, callback) {
        // Compute bundled lines
        var lines = [],
            bundledLines = [],
            bundlingResults,
            nodes,
            edges,
            count = 0;

        data.forEach(function (d) {
            lines.push(dimensions.map(function (p) {
                return [x(p), ranges[p](d[p])];
            }));
        });

        lines.forEach(function () {
            bundledLines.push(new Array(dimensions.length - 1));
        });

        lines[0].forEach(function (_, i) {

            if ((i + 1) === lines[0].length) {
                return;
            }

            nodes = {};
            edges = [];

            lines.forEach(function (line, j) {
                nodes[j + '_1'] = {
                    x: line[i][0],
                    y: line[i][1]
                };
                nodes[j + '_2'] = {
                    x: line[i + 1][0],
                    y: line[i + 1][1]
                };
                edges.push({
                    source: j + '_1',
                    target: j + '_2'
                });
            });

            // Perform edge bundling
            bundleEdges(nodes, edges, i, function (bundlingResults, index) {
                bundlingResults.forEach(function (line, i) {
                    bundledLines[i][index] = line.map(function (point) {
                        return [point.x, point.y];
                    });
                });
                count += 1;
                if (count === (dimensions.length - 1)) {
                    bundledLines = bundledLines.map(function (line) {
                        return line.reduce(function (a, b) {
                            return a.concat(b);
                        }, []);
                    });
                    callback(bundledLines);
                }
            });

        });
    }

    // Define function that will draw the chart given data and dimensions (i.e. list of MGD indicators)
    var drawChart = function (data, dimensions) {

        if (data === undefined || data.length === 0 || !dimensions) {
            return;
        }

        // Clean space
        svg.selectAll('*')
            .remove();
        d3.select('#loading')
            .remove();

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            var actives = dimensions.filter(function (p) {
                    return !ranges[p].brush.empty();
                }),
                extents = actives.map(function (p) {
                    return ranges[p].brush.extent();
                });
            foreground.classed('displayed', function (d) {
                return actives.every(function (p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                });
            });
        }

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions);

        prepareLines(data, dimensions, function (lines) {
            // Add lines.
            foreground = svg.append("g")
                .attr("class", "foreground")
                .selectAll("path")
                .data(data)
                .enter()
                .append("path")
                .attr("d", function (_, i) {
                    return line(lines[i]);
                })
                .on('mouseover', function (d) {
                    d3.select('#text')
                        .text(d['']);
                    this.parentNode.appendChild(this);
                })
                .on('mouseout', function () {
                    d3.select('#text')
                        .text('');
                });

            // Entry animation effect
            foreground.each(function () {
                var oneLine = d3.select(this);
                setTimeout(function () {
                    oneLine.classed('displayed', true);
                }, Math.random() * 2500);
            });
        });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter()
            .append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            });

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this)
                    .call(axis.scale(ranges[d])
                        .ticks(3));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", function (_, i) {
                return i % 2 === 0 ? -12 : -32;
            })
            .text(function (d) {
                return d;
            });

        // Remove tick lines
        d3.selectAll('.tick line')
            .remove();
        d3.selectAll('.axis path.domain')
            .attr('d', function () {
                return d3.select(this)
                    .attr('d')
                    .replace(/^M-6/, 'M-3,0H3')
                    .replace(/H-6$/, 'H-3H3');
            });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this)
                    .call(ranges[d].brush = d3.svg.brush()
                        .y(ranges[d])
                        .on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

    };


    // MENU INTERACTIONS
    d3.selectAll('#top, #goback-btn')
        .on('click', function () {
            d3.selectAll('#add, #about')
                .classed('active', false);
        });

    d3.select('#about-btn')
        .on('click', function () {
            d3.event.stopPropagation();
            d3.select('#add')
                .classed('active', false);
            d3.select('#about')
                .classed('active', !d3.select('#about')
                    .classed('active'));
        });

    d3.select('#add-btn')
        .on('click', function () {
            d3.event.stopPropagation();
            d3.select('#about')
                .classed('active', false);
            d3.select('#add')
                .classed('active', !d3.select('#add')
                    .classed('active'));
        });

    // ADD/REMOVE INDICATORS INTERACTIONS
    var goal = d3.select('#add ul')
        .selectAll('li')
        .data(d3.keys(goals))
        .enter()
        .append('li');

    goal
        .append('span')
        .classed('icon', true)
        .on('click', function () {
            d3.select(this)
                .classed('expanded', !d3.select(this)
                    .classed('expanded'));
            d3.select(this.parentElement)
                .select('span.goal')
                .classed('active', !d3.select(this.parentElement)
                    .select('span.goal')
                    .classed('active'));
        });

    goal
        .append('span')
        .classed('goal', true)
        .on('click', function () {
            d3.select(this)
                .classed('active', !d3.select(this)
                    .classed('active'));
            d3.select(this.parentElement)
                .select('span.icon')
                .classed('expanded', !d3.select(this.parentElement)
                    .select('span.icon')
                    .classed('expanded'));
        })
        .text(function (d) {
            return d;
        });

    goal.append('ul');

    var indicators = goal
        .selectAll('ul')
        .selectAll('li')
        .data(function (d) {
            return goals[d].sort();
        })
        .enter()
        .append('li');

    indicators
        .append('input')
        .attr('type', 'checkbox')
        .attr('value', function (d) {
            return d;
        })
        .attr('name', 'indicator')
        .attr('checked', function (d) {
            return initialDimensions.indexOf(d) > -1 ? 'checked' : null;
        });

    indicators
        .append('span')
        .classed('total', true);

    indicators
        .append('span')
        .text(function (d) {
            return d;
        });

    d3.select('#update-chart-btn')
        .on('click', function () {
            var dimensions = d3.selectAll('input:checked')
                .data()
                .sort(),
                filteredData = data.filter(function (datum) {
                    return dimensions.every(function (dim) {
                        return datum[dim] !== '';
                    });
                });
            d3.selectAll('#add, #about')
                .classed('active', false);
            setTimeout(function () {
                drawChart(filteredData, dimensions);
            }, 100);
        });


    // LOAD DATA
    d3.tsv("parallel_2013.csv", function (error, csv) {

        // Assign data to the variable in the outer scope
        data = csv;

        // Populate indicators totals
        indicators.selectAll('span.total')
            .text(function (indicator) {
                return data.filter(function (country) {
                        return country[indicator] !== '';
                    })
                    .length;
            })
            .attr('title', function () {
                return 'There are ' + d3.select(this)
                    .text() + ' countries in this dataset containing this indicator';
            });

        // Click on 'Update chart' button
        d3.select('#update-chart-btn')
            .on("click")();
    });

};