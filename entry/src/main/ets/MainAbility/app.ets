import featureAbility from '@ohos.ability.featureAbility';
import LogUtil from '../common/utils/LogUtils'

export default {
  onCreate() {
    LogUtil.info("", 'Application onCreate')
    let promise = featureAbility.startAbility(
      {
        want:
        {
          bundleName: "com.example.myapplication.hmservice",
          abilityName: "com.example.entry.ServiceAbility",
        },
      }
    );
  },
  onDestroy() {
    LogUtil.info("", 'Application onDestroy')
  },
}