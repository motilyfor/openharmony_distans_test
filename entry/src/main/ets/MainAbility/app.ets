import featureAbility from '@ohos.ability.featureAbility';
import LogUtil from '../common/utils/LogUtils'

export default {
  onCreate() {
    LogUtil.info("",'Application onCreate')
    let promise = featureAbility.startAbility(
      {
        want:
        {
          bundleName: "com.motilyfor.testservice",
          abilityName: "com.motilyfor.entry.ServiceAbility",
        },
      }
    );
  },
  onDestroy() {
    LogUtil.info("",'Application onDestroy')
  },
}