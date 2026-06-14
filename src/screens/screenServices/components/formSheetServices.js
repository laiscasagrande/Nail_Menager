import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormSheet from "../../../components/FormSheet";
import { TextInput } from "react-native-paper";
import { Upload } from "lucide-react-native";
import { useRef } from "react";
import { COLORS } from "../../../constants/colors";
import { Controller, useFormContext } from "react-hook-form";
import { forwardRef } from "react";
import { useTheme } from '../../../context/ThemeContext';

export const FormSheetServices = forwardRef(({ pickImage, editingId, onSave, onCancel, onSheetChange }, ref) => {
    const { theme } = useTheme();
    const { handleSubmit, control, watch } = useFormContext();
    const image = watch('image');

    return (
        <FormSheet ref={ref} onChange={onSheetChange}>
            <View style={[styles.container, { backgroundColor: theme.card }]}> 
                <View style={styles.form}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                        <Text style={[styles.formTitle, { color: theme.primary }]}>Cadastrar Novo Serviço</Text>
                    <Controller
                        control={control}
                        name="procedure"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    style={{ width: '100%' }}
                                    label="Procedimento"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!error}
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    style={{ width: '100%' }}
                                    label="Preço"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="numeric"
                                    error={!!error}
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name="duration"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    style={{ width: '100%' }}
                                    label="Duração"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!error}
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </>
                        )}
                    />

                    </View>
                </View>

                <View>
                    <View style={styles.imageRow}>
                        <TouchableOpacity style={styles.buttonImage} onPress={pickImage}>
                            <View style={styles.buttonImageContent}>
                                <View style={styles.buttonImageIcon}>
                                    <Upload size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={[styles.buttonImageLabel, { color: theme.primary }]}>Anexar imagem</Text>
                                    <Text style={[styles.buttonImageSubLabel, { color: theme.subtitle }]}>JPG, PNG até 5MB</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {image && (
                            <Image source={{ uri: image }} style={styles.preview} />
                        )}
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit(onSave)}>
                            <Text style={styles.buttonText}>
                                {editingId ? 'Atualizar' : 'Salvar'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </FormSheet>
    );
})

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 12
    },
    form: {
        gap: 5,
         width: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    imageRow: {
        width: '100%',
        height: 65,
        marginBottom: 15,
        flexDirection: "row",
        gap: 10,
    },
    buttonRow: {
        width: '100%',
        height: 65,
        marginBottom: 15,
        flexDirection: "row",
        gap: 10,
    },
    buttonImage: {
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        backgroundColor: '#FFF0F5',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: 65,
    },
    buttonImageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    buttonImageIcon: {
        backgroundColor: '#FFD6E7',
        borderRadius: 8,
        padding: 8,
    },
    buttonImageLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    buttonImageSubLabel: {
        fontSize: 11,
        color: '#aaa',
        marginTop: 1,
    },
    preview: {
        width: 65,
        height: 65,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        color: COLORS.white,
    },
    buttonSave: {
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    buttonCancel: {
        borderRadius: 10,
        backgroundColor: COLORS.gray,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: -3,
        marginBottom: 4,
    },
});