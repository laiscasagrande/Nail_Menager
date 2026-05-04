import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

export default function HeaderButton() {
    return (
        <TouchableOpacity
            onPress={() => console.log('clicou')}
            style={{ marginRight: 10 }}
        >
            <Icon source="filter" size={28} color={'#fff'} />
        </TouchableOpacity>
    )
}