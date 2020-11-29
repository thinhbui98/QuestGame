import { Platform } from 'react-native';
const ENV = {
    DEFAULT_CHARATER_TOP_ANIMATED: Platform.OS == 'ios' ? 290 : 260,
    DEFAULT_BACKGROUND_BOTTOM_ANIMATED: Platform.OS == 'ios' ? 180 : 210,
}

export default ENV