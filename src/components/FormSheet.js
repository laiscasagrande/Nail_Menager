import React, { forwardRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COLORS } from '../constants/colors';

const FormSheet = forwardRef(({ children, onChange }, ref) => {
  const snapPoints = useMemo(() => ['7%', '80%'], []);

  return (
    <BottomSheet
      ref={ref}
      index={0} 
      snapPoints={snapPoints}
      onChange={onChange}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: COLORS.primary, width: 70 }}
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