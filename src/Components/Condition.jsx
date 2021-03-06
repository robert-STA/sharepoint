import React, { Component } from 'react';
import {
    Container,
    Col,
    Row,
    Button,
    Input,
    Label,
    InputGroup,
    DropdownMenu,
    InputGroupButtonDropdown,
    DropdownToggle,
    DropdownItem
} from 'reactstrap';
import CurrentRules from './CurrentRules.jsx';


class Condition extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.newRule = this.newRule.bind(this);
        this.editRule = this.editRule.bind(this);
        this.selectRule = this.selectRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.clearRules = this.clearRules.bind(this);
        this.toggleValueDropdownOpen = this.toggleValueDropdownOpen.bind(this);
        this.state = {
            operator: '==',
            operand: '@currentField',
            operand2: '',
            value: '',
            selectedRule: '',
            rules: this.props.rules,
            valueDropdownOpen: false,
            reset: this.props.reset
        };
    }

    componentDidUpdate() {
        if (this.props.resetRules)
            this.setState({
                rules: this.props.rules
            })

        if (this.state.reset)
            this.clearRules;


    }


    newRule() {
        var arr = this.state.rules.slice();
        arr.length > 0 ? '' : arr = [];
        arr.push({operator: this.state.operator, operand: this.state.operand, operand2: this.state.operand2, value: this.state.value});
        this.setState({
          rules: arr,
          value: ''
        }, () => { this.props.updateKey(this.props.index, this.props.name, this.state.rules) });    
        this.props.setValue(arr);
    }
    
      selectRule(index) {
        switch (index) {
          case this.state.selectedRule:
            this.setState({
              selectedRule: '',
              operand: ''
            });
            break;
    
          default:
            var rule = this.state.rules[index];
            this.setState({
                selectedRule: index,
                operator: rule.operator,
                operand: rule.operand,
                operand2: rule.operand2,
                value: rule.value
            });
            
        } 
        
      }
    
    editRule() {
        var arr = this.state.rules.slice();
        arr[this.state.selectedRule].operator = this.state.operator;
        arr[this.state.selectedRule].operand = this.state.operand;
        arr[this.state.selectedRule].operand2 = this.state.operand2;
        arr[this.state.selectedRule].value = this.state.value;
        this.props.setValue(arr);
        this.setState({
          rules: arr
        }, () => { this.props.updateKey(this.props.index, this.props.name, this.state.rules) });    

    }

      deleteRule() {
        if (this.state.selectedRule !==  '') {
          var arr = this.state.rules;
          var deleted_Value = arr[this.state.selectedRule].value;
          arr.splice(this.state.selectedRule, 1);
          this.props.setValue(arr);
          this.setState({
            rules: arr,
            operand: '@currentField',
            operand2: '',
            value: deleted_Value,
            selectedRule: ''
          }, () => { this.props.updateKey(this.props.index, this.props.name, this.state.rules) });
        }
      }

    clearRules() {
        this.props.setValue([]);
        this.setState({
            rules: [],
            operand: '@currentField',
            operand2: '',
            selectedRule: ''
        }, () => { this.props.updateKey(this.props.index, this.props.name, this.state.rules) });
    }

    

    handleInputChange(event) {
        const target = event.target;
        let value = target.type === 'button' ? ( this.props.name === 'background-color' ? this.props.colors[target.innerHTML] : target.innerHTML) : target.value;
        const name = target.name;
        this.setState({
          [name]: value,
        });

        
    }

    toggleValueDropdownOpen() {
        this.setState({
            valueDropdownOpen: !this.state.valueDropdownOpen
        });
    }

    render() {
        return (
            <Col>
                <Row>
                    <Col sm='3'>
                        <Label className='label remove-text-highlighting'>Operand <span class='help-link' value="Operand" onClick={this.props.displayModal}>(help)</span></Label>
                        <Input className='operand center-input' type='text' name='operand' placeholder='Compare to' value={this.state.operand} onChange={this.handleInputChange} />
                    </Col>
                    <Col sm='2'>
                        <Label className='label remove-text-highlighting'>Operator</Label>
                        <Input className='operator center-input' type='select' name='operator' value={this.state.operator} onChange={this.handleInputChange}>
                            <option>==</option>
                            <option>!=</option> 
                            <option>&lt;</option>
                            <option>&gt;</option>
                            <option>&lt;=</option>
                            <option>&gt;=</option>
                        </Input>  
                    </Col>
                    <Col sm='3'>
                        <Label className='label remove-text-highlighting'>Operand2 <span class='help-link' value="Operand2" onClick={this.props.displayModal}>(help)</span></Label>
                        <Input className='operand center-input' type='text' name='operand2' placeholder='Compare to' value={this.state.operand2} onChange={this.handleInputChange} />
                    </Col>
                    <Col sm='4'>
                        <Label className='label remove-text-highlighting'>Value <span class='help-link' value={this.props.name} onClick={this.props.displayModal}>(help)</span></Label>
                        <InputGroup>   
                            <Input className='center-input' type='text' name='value' style={ { [this.props.name] : this.state.value} } 
                                placeholder={  this.props.nameChoices[this.props.name] !== undefined && this.props.nameChoices[this.props.name].placeholder !== undefined ? this.props.nameChoices[this.props.name].placeholder : '' } value={this.state.value} onChange={this.handleInputChange} />
                            <InputGroupButtonDropdown addonType='append' isOpen={this.state.valueDropdownOpen} toggle={this.toggleValueDropdownOpen}
                            style={{ 'visibility': ((this.props.nameChoices[this.props.name] === undefined || this.props.nameChoices[this.props.name].options === undefined) && this.props.name !== 'background-color' ?  'hidden' : 'visible') }}>
                                <DropdownToggle color='primary' caret></DropdownToggle>
                                <DropdownMenu>
                                    
                                    { (this.props.nameChoices[this.props.name] !== undefined && this.props.nameChoices[this.props.name].options !== undefined
                                        ? this.props.nameChoices[this.props.name].options.split(',').map((key, i) => {
                                            return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                    }) : (this.props.name === 'background-color' ? Object.keys(this.props.colors).map((key, i) => {
                                        return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                    })
                                    : '') )}
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                        </InputGroup>    
                    </Col>
                </Row>
                <br />

                <Row className='padded-row'>
                    <Col sm='6'>
                        <Button className='condition-button center-input'color={this.state.selectedRule === '' ? 'success' : 'info'} onClick={this.state.selectedRule === '' ? this.newRule : this.editRule}>{this.state.selectedRule === '' ? 'New Condition' : 'Edit Condition'}</Button>
                    </Col>
                    <Col sm='6'>
                        <Button className='condition-button center-input' color='danger' onClick={this.clearRules}>Clear All Conditions</Button>
                    </Col>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Label className='label remove-text-highlighting'>Condtions ({this.props.name})<br />{this.state.selectedRule === '' ? '*Click to Select*' : '*Click to Deselect*'}</Label>
                                <CurrentRules className='center-input' name={this.props.name} rules={this.props.rules} selectRule={this.selectRule} selectedRule={this.state.selectedRule} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='padded-row'>
                                <Button className='condition-button center-input move-button' value='up' style={this.state.selectedRule === '' ? {'visibility': 'hidden'} : {}} onClick={(ele) => { this.props.moveRule(ele, this.state.selectedRule); this.setState({ selectedRule: (this.state.selectedRule === 0 ? 0 : this.state.selectedRule-1)}); } }>Move Rule Up</Button>
                            </Col>
                            <Col className='padded-row'>
                                <Button className='condition-button center-input' color='danger' style={this.state.selectedRule === '' ? {'visibility': 'hidden'} : {}} onClick={this.deleteRule}>Delete Condition</Button>
                            </Col>
                            <Col className='padded-row'>
                                <Button className='condition-button center-input move-button' value='down' style={this.state.selectedRule === '' ? {'visibility': 'hidden'} : {}} onClick={(ele) => { this.props.moveRule(ele, this.state.selectedRule); this.setState({ selectedRule: (this.state.selectedRule === this.state.rules.length-1 ? this.state.selectedRule : this.state.selectedRule+1)}); }}>Move Rule Down</Button>
                            </Col>
                        </Row>
                    </Container>
                </Row> 
            </Col>
        );
    }
}

export default Condition;