// @ts-nocheck
import wifi from '@ohos.wifi';
import parameter from '@ohos.systemparameter'
import LogUtil from '../common/utils/LogUtils'
import bluetooth from '@ohos.bluetooth';
//import geolocation from '@ohos.geolocation';

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

function connectWiFi(ssid: string, password: string, bssid: string) {
    LogUtil.info(MODULE_TAG, "ssid:" + ssid + " bssid:" + bssid + " password:" + password)
    let connectParam: any = {
        "ssid": ssid,
        "bssid": bssid,
        "preSharedKey": password,
        "isHiddenSsid": false, // we don't support connect to hidden ap yet
        "securityType": 3
    };
    let ret = false;
    if (wifi.isConnected() === true) {
        wifi.disconnect();
        LogUtil.info(MODULE_TAG + 'disconnect WiFi ret is ' + ret);
        registerWiFiConnectionObserver((code: Number) => {
            if (code === 0) {
                ret = wifi.connectToDevice(connectParam);
                unregisterWiFiConnectionObserver();
            }
        })
    } else {
        ret = wifi.connectToDevice(connectParam);
        LogUtil.info(MODULE_TAG , 'connect WiFi ret is ' + ret);
    }
    return ret;
}

/**
 * Disconnect wifi
 */
function disconnectWiFi() {
    if (!isWiFiConnected()) {
        return true;
    }
    let ret = wifi.disconnect();
    LogUtil.info(MODULE_TAG , 'disconnect WiFi result is : ' + ret);
    return ret;
}

function enableBluetooth(): boolean {
    ret = bluetooth.enableBluetooth()
    LogUtil.info(MODULE_TAG , 'enable Bluetooth result is : ' + ret);
    return ret;
}

function registerWiFiConnectionObserver(callback) {
  LogUtil.info(MODULE_TAG + 'start register wifi connection observer');
  wifi.on('wifiConnectionChange', callback);
}
function unregisterWiFiConnectionObserver() {
    LogUtil.info(MODULE_TAG + 'start unregister wifi connection observer');
    wifi.off('wifiConnectionChange');
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


//// TODO gps test
//var requestInfo = {'scenario': 0x301, 'timeInterval': 0, 'distanceInterval': 0, 'maxAccuracy': 0};
//
//var locationChange = (location) => {
//    LogUtil.info(MODULE_TAG ,'locationChanger: data: ' + JSON.stringify(location));
//};
//
//try {
//    LogUtil.info(MODULE_TAG, 'enable location');
//    geolocation.enableLocation();
//} catch (e) {
//    LogUtil.error(MODULE_TAG , "enableLocation error: " + e);
//}
//
//geolocation.on('locationChange', requestInfo, locationChange);

//for(;;) {
//    LogUtil.info(MODULE_TAG ,'getCurrentLocation: data');
//    var loca = geolocation.getCurrentLocation();
//    LogUtil.info(MODULE_TAG ,'getCurrentLocation: data: ' + JSON.stringify(loca));
//    sleep(1000)
//}



for (;; ) {
    LogUtil.info(MODULE_TAG , 'get_parameter');
    let op = "default"
    try {
        op = parameter.getSync("wifi.op", "default");
        if(op != "default") {
            parameter.setSync("wifi.op", "default");
            LogUtil.info(MODULE_TAG, ":op:" + op);
        }
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
            let pw = parameter.getSync("wifi.pw", "null")
            let bssid = parameter.getSync("wifi.bssid", "null")
            if (ssid != "null") {
                connectWiFi(ssid, pw, bssid);
            }
            break;
        case 'disconnect':
            disconnectWiFi();
            break
        case 'isactive':
            isWiFiActive();
            break;
        case 'isconnect':
            isWiFiConnected();
            break;
        case 'getipinfo':
            var info = wifi.getDeviceConfigs();
            LogUtil.info(MODULE_TAG, 'ipinfo:', JSON.stringify(info));
            break;
        case 'staticip':
            let ipconfig : wifi.IpInfo = {
                "ipAddress": 3232261478, //192.168.3.9
                "gateway": 3232261568, //192.168.101.192
                "dnsServers": [3232261568,134743044]
            }
            let connectParam: wifi.WifiDeviceConfig = {
                "ssid": "Redmi",
                "bssid": "86:be:18:85:29:59",
                "preSharedKey": "hycasdfgh",
                "isHiddenSsid": false, // we don't support connect to hidden ap yet
                "securityType": 3,
                "ipType": 1,
                "staticIp": ipconfig
            };
            LogUtil.info(MODULE_TAG, 'addDeviceConfig:');
            wifi.addDeviceConfig(connectParam)
            break;
        case 'updatenetwork':
            let config : wifi.IpInfo = {
                "ipAddress": 3232236297, //192.168.3.9
                "gateway": 3232236289, //192.168.3.1
                "dnsServers": [3232236289,134743044] //192.168.3.1 ,8,8,4,4
            };
            let param: wifi.WifiDeviceConfig = {
                "ssid": "yqstest",
                "bssid": "f4:8e:92:02:8f:c0",
                "preSharedKey": "qweqweqwe",
                "isHiddenSsid": false, // we don't support connect to hidden ap yet
                "securityType": 3,
                "ipType": 1,
                "staticIp": config
            };
            wifi.updateNetwork(param)
            break;
        case 'sethostconfig':
            let hostconfig : wifi.HotspotConfig = {
                "ssid" : "hottest",
                "securityType": 3,
                "band" : 1,
                "preSharedKey" : "qweqweqwe"
            }
            let ret = wifi.setHotspotConfig(hostconfig);
            LogUtil.error(MODULE_TAG, "set hotspot:" + ret);
            break;
        case 'enablehot':
            let res = wifi.enableHotspot();
            LogUtil.error(MODULE_TAG, "enable hotspot failed" + res);
            break;
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
