import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Plus } from "lucide-react-native";
import { useTheme } from '../context/ThemeContext';

export default function ActionButtonAdd({onPress}) {
    const { theme } = useTheme();
    return (
        <Button style={[styles.button, { backgroundColor: theme.primary }]} onPress={onPress}>
            <Plus size={32} color={theme.text} />
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
})