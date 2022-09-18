// @ts-nocheck
import wifi from '@ohos.wifi';
import parameter from '@ohos.systemparameter'
import LogUtil from '../common/utils/LogUtils'
import bluetooth from '@ohos.bluetooth';

const MODULE_TAG = "DS_TEST"

function isWiFiActive(): boolean {
    const isActive: boolean = wifi.isWifiActive();
    LogUtil.info(MODULE_TAG , 'check WiFi active status is : ' + isActive);
    return isActive;
}

function isWiFiConnected(): boolean {
    let ret = wifi.isConnected();
    LogUtil.info(MODULE_TAG , 'check WiFi connected status is : ' + ret);
    return ret;
}

function enableWiFi() {
    LogUtil.info(MODULE_TAG , 'enable WiFi');
    if (wifi.isWifiActive() === true) {
        LogUtil.info(MODULE_TAG , 'wifi is already active');
        return;
    }
    const ret: boolean = wifi.enableWifi();
    LogUtil.info(MODULE_TAG , 'enable WiFi result is : ' + ret);
}

function disableWifi() {
    this.setUserSelectedAp(null);

    if (wifi.isWifiActive() !== true) {
        LogUtil.info(MODULE_TAG , 'wifi is already inactive');
        return;
    }
    const ret: boolean = wifi.disableWifi();
    LogUtil.info(MODULE_TAG , 'disable WiFi result is : ' + ret);
}

function scanWiFi(): boolean {
    const ret: boolean = wifi.scan();
    LogUtil.info(MODULE_TAG , 'start scan WiFi result is : ' + ret);
    return ret;
}

function connectWiFi(ssid: string, password: string) {
    let apInfo = this.userSelectedAp.getApInfo();
    let connectParam: any = {
        "ssid": apInfo.ssid,
        "bssid": apInfo.bssid,
        "preSharedKey": password,
        "isHiddenSsid": false, // we don't support connect to hidden ap yet
        "securityType": apInfo.securityType
    };

    if (wifi.isConnected() === true) {
        wifi.disconnect();
    }

    let ret = wifi.connectToDevice(connectParam);
    LogUtil.info(MODULE_TAG , 'connect WiFi ret is ' + ret);
    return ret;
}

/**
 * Disconnect wifi
 */
function disconnectWiFi() {
    this.setUserSelectedAp(null);
    let ret = wifi.disconnect();
    LogUtil.info(MODULE_TAG , 'disconnect WiFi result is : ' + ret);
    return ret;
}

function enableBluetooth(): boolean {
    ret = bluetooth.enableBluetooth()
    LogUtil.info(MODULE_TAG , 'enable Bluetooth result is : ' + ret);
    return ret;
}

export default {
    onStart() {
        LogUtil.info(MODULE_TAG , 'ServiceAbility onStart');
    },
    onStop() {
        LogUtil.info(MODULE_TAG , 'ServiceAbility onStop');
    },
    onCommand(want, startId) {
        LogUtil.info(MODULE_TAG , 'ServiceAbility onCommand');
    }
};

for (;; ) {

    LogUtil.info(MODULE_TAG , 'get_parameter');
    let op = "default"
    try {
        op = parameter.getSync("wifi.op", "default");
        parameter.setSync("wifi.op", "default");
        LogUtil.info(MODULE_TAG, ":op:" + op);
    } catch (e) {
        LogUtil.error(MODULE_TAG , "set unexpected error: " + e);
    }

    switch (op) {
        case 'enable':
            enableWiFi();
            break;
        case 'disable':
            disableWifi();
            break;
        case 'scan':
            scanWiFi();
            break;
        case 'connect':
            let ssid = parameter.getSync("wifi.ssid", "null")
            let pws = parameter.getSync("wifi.psw", "null")
            if (ssid != "null") {
                connectWiFi(ssid, pws);
            }
        case 'disconnect':
            disconnectWiFi();
            break
        case 'isactive':
            isWiFiActive();
            break;
        case 'isconnect':
            isWiFiConnected();
        default:
            break;
    }
    sleep(1000)
}

function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}
