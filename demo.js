/**
 * @jsx React.DOM
 */

var Demo = React.createClass({
  getInitialState: function () {
    return {
      selections: []
    }
  },

  handleSelections: function (e, selections) {
    this.setState({
      selections: selections
    })
  },

  render: function () {
    var data =[
      {id: 0, text: "Option 1"},
      {id: 1, text: "Option 2"},
      {id: 2, text: "Option 3"},
      {id: 3, text: "Option 4"}
    ];

    return (
        <div>
          <Select2Component
              id="the-hidden-input-id"
              dataSet={data}
              onSelection={this.handleSelections}
              placeholder="Select some options"
              multiple={true}
              styleWidth="25%"
          />
          {JSON.stringify(this.state.selections, undefined, 2)}
        </div>
        );
  }
});

React.renderComponent(<Demo />, document.getElementById("render_area"));
