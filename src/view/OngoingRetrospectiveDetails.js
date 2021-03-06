/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import WarningModalBox from '../components/WarningModalBox';
import TextCell from './TextCell';
var FixedDataTable = require('fixed-data-table');
const {Table, Column, Cell, ColumnGroup} = FixedDataTable;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {getScreenMode} from '../utils/index';

class OngoingRetrospectiveDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            warningShow: false,
            WaringHeaderMsg : 'Warning',
            modalBody_warning: 'Select project first and proceed.',
            retrospectives: []
        };
    }

    componentWillMount(){
        this.firebaseRef = firebase.database().ref('retrospectives');
        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            //console.log("Tree for notes : ", 'retrospectives');
            var retrospectives = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var retrospective = childSnapshot.val();
                retrospective['.key'] = childSnapshot.key;
                retrospectives.push(retrospective);
            }.bind(this));

            this.setState({
                retrospectives: retrospectives
            });
        }.bind(this));
    }

    handleView(key){
        this.props.actions.RetrospectiveKey_selected(key);
        this.props.actions.loadPage('/dashboard');
    }

    render(){
        var {selected_project_id,selected_project_name} = this.props;
        var screenSize = getScreenMode();
        var {retrospectives} = this.state;
        var dataList = [];
        if(retrospectives.length != 0){
            dataList = retrospectives;
        }

        if(dataList.length == 0){
            return(
                <div style={{margin:"10px", fontSize:"20px"}}>
                    No retrospectives to display.
                </div>
            );
        }else {
            return(
                <div style={{margin:"10px"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={dataList.length}
                        width={1500}
                        maxHeight={500}
                        headerHeight={50}>

                        <Column
                            header={<Cell style={{backgroundColor: '#484848', color:'#ffffff'}}> Sprint End Date </Cell>}
                            cell={<TextCell data={dataList} col="sprint_end_date" />}
                            width={500}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Retrospective Time </Cell>}
                            cell={<TextCell data={dataList} col="retrospective_time" />}
                            width={500}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Action </Cell>}
                            cell={<TextCell data={dataList} col="view" handleView={this.handleView.bind(this)} />}
                            width={500}
                        />

                    </Table>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    windowWidth: state.scrums.windowWidth,
    windowHeight: state.scrums.windowHeight,
    selected_project_id: state.scrums.selected_project_id,
    selected_project_name: state.scrums.selected_project_name
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(OngoingRetrospectiveDetails);
