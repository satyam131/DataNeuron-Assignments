import React from 'react';
import { ResizableBox } from 'react-resizable';
import './ResizableLayout.css';
import { useState } from 'react';

const ResizableComponent = ({ id, children, onResize, initialWidth, value, onChange }) => {

  return (
    <ResizableBox
      className="resizable-component"
      height={200}
      width={initialWidth}
      onResize={onResize}
      handle={<div className="resize-handle" />}
    >
      <div className="component" id={id}>
        <h3>{value}</h3>
        <input type="text" value={value} onChange={(e) => onChange(id, e.target.value)} />
        {children}
      </div>
    </ResizableBox>
  );
};

class ResizableGridLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentData: {
        component1: "Hello, from Component 1 :)",
        component2: "Hello, from Component 2 :)",
        component3: "Hello, from Component 3 :)",
      },
    };
  }

  handleResize = (index) => (e, { size }) => {
    console.log(`Resized component ${index} to width: ${size.width}, height: ${size.height}`);
  };

  handleChange = (id, value) => {
    this.setState((prevState) => ({
      componentData: {
        ...prevState.componentData,
        [id]: value,
      },
    }));
  };

  handleAdd = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/addData/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: this.state.componentData[id] }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Add Response:', data);
        console.log(`Data for ${id} added successfully.`);
        alert('Added Successfully :)');
      } else {
        console.error('Failed to add data.');
      }
    } catch (error) {
      console.error('Error in handleAdd:', error);
    }
  };

  handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/updateData/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: this.state.componentData[id] }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Update Response:', data);
        console.log(`Data for ${id} updated successfully.`);
        alert('Updated Successfully :)');
      } else {
        console.error('Failed to update data.');
      }
    } catch (error) {
      console.error('Error in handleUpdate:', error);
    }
  };

  handleCount = async () => {
    const response = await fetch('http://localhost:5000/api/getCount');
    const data = await response.json();
    alert(`Add count: ${data.addCount}, Update count: ${data.updateCount}`);
  };

  fetchData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/data/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const { success, message, component } = await response.json();
        const dataValue = component.data;
        console.log('Data Value:', dataValue);
        this.state.fetchedData = dataValue;
        return dataValue;
      } else {
        console.error('Failed to fetch data.');
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  render() {

    return (
      <div className="container">
        <div className="row">

          <ResizableComponent
            id="component1"
            onResize={this.handleResize(1)}
            initialWidth="50%"
            value={this.state.componentData.component1}
            onChange={this.handleChange}
          >
            <div className='buttons'>
              <button onClick={() => this.handleAdd('component1')}>Add</button>
              <button onClick={() => this.handleUpdate('component1')}>Update</button>
            </div>
          </ResizableComponent>

          <ResizableComponent
            id="component2"
            onResize={this.handleResize(2)}
            initialWidth="50%"
            value={this.state.componentData.component2}
            onChange={this.handleChange}
          >
            <div className='buttons'>
              <button onClick={() => this.handleAdd('component2')}>Add</button>
              <button onClick={() => this.handleUpdate('component2')}>Update</button>
            </div>
          </ResizableComponent>

        </div>
        <div className="row">

          <ResizableComponent
            id="component3"
            onResize={this.handleResize(3)}
            initialWidth="100%"
            value={this.state.componentData.component3}
            onChange={this.handleChange}
          >
            <div className='buttons'>
              <button onClick={() => this.handleAdd('component3')}>Add</button>
              <button onClick={() => this.handleUpdate('component3')}>Update</button>
            </div>
          </ResizableComponent>
        </div>
        <div>
          <button onClick={this.handleCount} className='clickButton'>Get Count</button>
        </div>
      </div>
    );
  }
}

export default ResizableGridLayout;
