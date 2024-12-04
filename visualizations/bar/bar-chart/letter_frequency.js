import * as d3 from 'd3';

export const metadata = {
    name: 'Letter Frequency',
    description: 'Bar chart showing the frequency of letters in the English language',
    html: `
        <div class="visualization-container">
            <div id="letter-frequency-chart"></div>
        </div>
    `,
    css: `
        .visualization-container {
            width: 50%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #letter-frequency-chart {
            width: 100%;
            height: 100%;
        }
        #letter-frequency-chart svg {
            display: block;
            margin: 0 auto;
        }
    `
};

const data = [
    {letter: "E", frequency: 0.1202},
    {letter: "T", frequency: 0.0910},
    {letter: "A", frequency: 0.0812},
    {letter: "O", frequency: 0.0768},
    {letter: "I", frequency: 0.0731},
    {letter: "N", frequency: 0.0695},
    {letter: "S", frequency: 0.0628},
    {letter: "R", frequency: 0.0602},
    {letter: "H", frequency: 0.0592},
    {letter: "D", frequency: 0.0432},
    {letter: "L", frequency: 0.0398},
    {letter: "U", frequency: 0.0288},
    {letter: "C", frequency: 0.0271},
    {letter: "M", frequency: 0.0261},
    {letter: "F", frequency: 0.0230},
    {letter: "Y", frequency: 0.0211},
    {letter: "W", frequency: 0.0209},
    {letter: "G", frequency: 0.0203},
    {letter: "P", frequency: 0.0182},
    {letter: "B", frequency: 0.0149},
    {letter: "V", frequency: 0.0111},
    {letter: "K", frequency: 0.0069},
    {letter: "X", frequency: 0.0017},
    {letter: "Q", frequency: 0.0011},
    {letter: "J", frequency: 0.0010},
    {letter: "Z", frequency: 0.0007}
];

export function createLetterFrequencyChart(container) {
    // Get the specific container for this visualization
    const visContainer = container.select('#letter-frequency-chart');
    visContainer.selectAll('*').remove();

    const width = 928;
    const height = 500;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    // Create the SVG container
    const svg = visContainer
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    // Create scales
    const x = d3.scaleBand()
        .domain(d3.groupSort(data, ([d]) => -d.frequency, d => d.letter))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.frequency)])
        .range([height - marginBottom, marginTop]);

    // Add the bars
    svg.append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.letter))
        .attr('y', d => y(d.frequency))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.frequency));

    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat(d => d.toLocaleString(undefined, {style: "percent"})));

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', marginTop)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Letter Frequency in English Language');

    // Add y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2))
        .attr('y', marginLeft / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Frequency');
}

// Hot Module Replacement
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        createLetterFrequencyChart(d3.select('#visualization'));
    });
}