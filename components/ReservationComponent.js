import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';


class Reservation extends Component{

    constructor(props){
        super(props);
        this.state = {
            guests : 1,
            smoking : false,
            date: new Date()
        }
    }

    static navigationOptions = {
        title : 'Reserve Table'
    }

    resetForm(){
        this.setState({
            guests : 1,
            smoking : false,
            date: new Date()
        });
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK?',
            'Number of guests: ' + this.state.guests.toString() + '\n' +
            'Smoking: ' + this.state.smoking.toString() + '\n' +
            'Date and Time: ' + moment(new Date(this.state.date)).format('LLL'),
            [ //Button Array
                { 
                    text: 'Cancel',
                    onPress: () => console.log('Reservation cancelled'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress : () => {
                        console.log(this.state);
                        this.persentLocalNotification(moment(new Date(this.state.date)).format('LLL'));
                        this.resetForm();
                    }
                }
            ],
            { cancelable: false} //for disabling dismissing behavior
        );
    }

    async obtainNotificationPermission(){
        let permisson = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permisson.status !== 'granted'){
            permisson = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permisson.status !== 'granted')
                Alert.alert('Permission not granted to show notifications');
        }
        return permisson;     
    }

    async persentLocalNotification(date){
        await this.obtainNotificationPermission();
        Notifications.presentNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios : {
                sound : true
            },
            android : {
                sound : true,
                vibrate: true,
                color: '#512DAB'
            }
        });
    }

    render() {
        return (
            <Animatable.View animation="zoomIn"  duration={2000} delay={1000}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}
                    >
                        <Picker.Item label='1' value='1'/>
                        <Picker.Item label='2' value='2'/>
                        <Picker.Item label='3' value='3'/>
                        <Picker.Item label='4' value='4'/>
                        <Picker.Item label='5' value='5'/>
                        <Picker.Item label='6' value='6'/>
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        onTintColor='#3f9688'
                        onValueChange={(value) => this.setState({smoking: value})}
                    >
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format='LLL'
                        mode='date'
                        placeholder='select date and time'
                        minDate={this.state.date}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        customStyles={{
                            dateIcon:{
                                position: 'absolute',
                                left : 0,
                                top: 4,
                                marginLeft : 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => this.setState({date: date})}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button 
                        title="Reserve"
                        color="#512DAB"
                        onPress={() => this.handleReservation()}
                        accessibilityLabel='Learn more about this purple button'
                        />
                </View>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DAB',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;