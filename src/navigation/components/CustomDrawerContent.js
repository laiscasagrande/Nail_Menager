import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";

export default function CustomDrawerContent(props) {
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            props.navigation.closeDrawer();
        } catch (error) {
            console.error('Erro ao sair:', error);
            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
        }
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <View>
                <Image source={require('../../../assets/logo.png')} style={styles.image}/>
                <DrawerItemList {...props} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    image: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
    },
    logoutButton: {
        marginLeft: 20,
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignSelf: 'flex-start',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});