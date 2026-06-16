import React, { forwardRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COLORS } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const FormSheet = forwardRef(({ children, onChange }, ref) => {
  const snapPoints = useMemo(() => ['80%'], []);
  const { theme } = useTheme();

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      onChange={onChange}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: theme.primary || COLORS.primary, width: 70 }}
      backgroundStyle={{ backgroundColor: theme.card || COLORS.white }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default FormSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    flexGrow: 1
  },
});