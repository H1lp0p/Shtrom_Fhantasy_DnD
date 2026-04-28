import ProgressView from "../ui-kit/ProgressView.jsx";
import AttributeApplier from "../ui-kit/AttributeApplier.jsx";
import format from "../lib/stringFormat.js";

function HPWidget(props) {
    const title = props.title ?? "❤️ Текущее HP";
    
    const [attribute] = useFrontmatterState(props.attributeKey ?? "сила", 10);
    
    const minHP = 0;
    
    const maxHP = React.useMemo(() => {
      const calculation = props.calculation ?? "20 + ${attribute} * 2";
      return eval(format(calculation, { attribute }));
    }, [attribute, props.calculation]);


    const [storedHP, setHP] = useFrontmatterState(
      props.storedAmountFMKey ?? "хп_текущее",
      100
    );

    const [barierValue, setBarierValue] = useFrontmatterState(
      props.barierAmountFMKey ?? "барьер_текущее",
      0
    );

    const [bariermaxHP, setBariermaxHP] = useFrontmatterState(
      props.barierMaxAmountFMKey ?? "барьер_наложенное",
      0
    );

    const prompt = usePromptModal()
  
    const onApply = (valueToApply) => {
      if (valueToApply >= 0){
        const sum = storedHP + valueToApply;
        const normalized = Math.max(Math.min(sum, maxHP), minHP);
        setHP(normalized);
      }
      else {
        const barierDamage = Math.max(valueToApply, -barierValue);
        const passedDamage = valueToApply - barierDamage;

        const resultSum = storedHP + passedDamage;
        const newBarier = Math.max(barierValue + barierDamage, 0);

        setBarierValue(newBarier);
        if (newBarier === 0){
          setBariermaxHP(0);
        }
        
        setHP(resultSum);
      }
    };

    const handleEditBarier = async () => {
      const valueToAdd = await prompt({
        title: "Сколько добавить барьера",
        placeholder: "10",
        submitText: "Добавить",
      });
      if (valueToAdd && Number(valueToAdd)) {
        setBarierValue(barierValue + Number(valueToAdd));
        setBariermaxHP(bariermaxHP + Number(valueToAdd));
      }
    }

    const handleClearBarier = () => {
      setBarierValue(0);
      setBariermaxHP(0);
    }
  
    return (
      <div>
        <h3>{title}</h3>
        <ProgressView
            id={`progress_${title}`} 
            current={storedHP} 
            max={maxHP}
        />
        {barierValue > 0 && (
          <div style={{ display: "flex", flexDirection: "row", gap: 16, width: "100%" }}>
            <span>Барьер:</span>
            <ProgressView
                id={`progress_2_${title}`} 
                current={barierValue} 
                max={bariermaxHP} 
            />
          </div>
        )}
        <AttributeApplier onSubmit={onApply} />
        <div style={{marginTop: "16px", width: "100%"}}>
          {barierValue > 0 && (
            <div style={{display: "flex", flexDirection: "row", gap: "16px"}}>
              <button style={{flex: 1}} onClick={handleClearBarier}>Очистить барьер</button>
              <button style={{flex: 1}} onClick={handleEditBarier}>Добавить</button>
            </div>
          )}
          {
            barierValue <= 0 && (
                <button style={{width: "100%"}} onClick={handleEditBarier}>Добавить барьер</button>
            )
          }
        </div>
      </div>
    );
  }

module.exports = HPWidget;