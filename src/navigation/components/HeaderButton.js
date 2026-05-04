import { TouchableOpacity } from "react-native";
import { ICONS } from "../../constants/icons";

export default function HeaderButton() {
    return (
        <TouchableOpacity
            onPress={() => console.log('clicou')}
            style={{ marginRight: 10 }}
        >
           <ICONS.filter/>
        </TouchableOpacity>
    )
}