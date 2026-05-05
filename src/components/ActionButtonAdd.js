import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { COLORS } from "../constants/colors";
import { Plus } from "lucide-react-native";

export default function ActionButtonAdd({onPress}) {
    return (
        <Button style={styles.button} onPress={onPress}>
            <Plus size={32} color={COLORS.white}/>
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    }
})