package main

import "os"
import "os/user"
import (
	"encoding/json"
	"context"
	"fmt"
	"time"
	"strconv" 
	"strings"
	"github.com/stianeikeland/go-rpio/v4"
	"log"
)

// App struct
type App struct {
	ctx context.Context
	pumps   map[int]Pump     
	recipes map[int]Recipe 
	isRaspberry bool
	pumpStates  map[int]bool
}
type OrderResponse struct {
	Status       string `json:"status"`        
	TotalTimeMs  int64  `json:"totalTimeMs"`  
	CocktailName string `json:"cocktailName"`  
}
type Pump struct {
	ID       int
	Name     string
	FlowRate float64
	Pin      rpio.Pin 
}




const configPath = "amounts.json"
func (a *App) ProcessPour(recipeID int) (string, error) { 
    amounts, _ := a.LoadAmounts()
    
    cocktail, exists := a.recipes[recipeID]
    if !exists {
        return "", fmt.Errorf("рецепт с ID %d не найден", recipeID)
    }
    
    for _, ing := range cocktail.Ingredients {
        idStr := strconv.Itoa(ing.PumpID)
        amounts[idStr] -= ing.Volume
    }
    
    a.SaveAmounts(amounts)
    return "SUCCESS", nil
}

func (a *App) LoadAmounts() (map[string]int, error) {
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return map[string]int{
			"0": 1000,
		 	"1": 1000, 
			"2": 1000, 
			"3": 1000,
			"4": 1000,
			"5": 1000,
			"6": 1000,
			"7": 1000,
			"8": 1000,
		}, nil
	}


	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	var amounts map[string]int
	err = json.Unmarshal(data, &amounts)
	return amounts, err
}

func (a *App) SaveAmounts(amounts map[string]int) error {
	data, err := json.MarshalIndent(amounts, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(configPath, data, 0644)
}


func (a *App) setPump(pumpID int, state bool) {
    if !a.isRaspberry { 
        fmt.Printf("[DEBUG] Симуляция: Помпа %d установлена в %v\n", pumpID, state)
        return 
    }
    
    pump, exists := a.pumps[pumpID]
    if !exists { 
        fmt.Printf("❌ ОШИБКА: Помпа %d не существует!\n", pumpID)
        return 
    }

    status := "ВКЛЮЧЕНА"
    if !state { status = "ВЫКЛЮЧЕНА" }
    fmt.Printf("🛠 ДЕЙСТВИЕ: Управление GPIO пином %d -> %s\n", pump.Pin, status)

    if state {
        pump.Pin.High()
    } else {
        pump.Pin.Low()
    }
}

func checkRoot() {
    currentUser, err := user.Current()
    if err != nil {
        log.Fatalf("❌ Не удалось определить пользователя: %v", err)
    }
    if currentUser.Uid != "0" {
        fmt.Println("⚠️ ВНИМАНИЕ: Программа запущена БЕЗ ROOT прав!")
        fmt.Println("   Для управления GPIO нужно запускать через sudo.")
    } else {
        fmt.Println("✅ Root права подтверждены.")
    }
}
func (a *App) ManualPumpControl(pumpID int) {
	newState := !a.pumpStates[pumpID]
	a.pumpStates[pumpID] = newState
    a.setPump(pumpID, newState)
}

func NewApp() *App {
	app := &App{
		pumps:   make(map[int]Pump),
        recipes: make(map[int]Recipe),
		pumpStates: make(map[int]bool),
	}
	checkRoot()

	pumpsData := map[int]Pump{
		0: {ID: 0, Name: "Wodka", FlowRate: 20.0, Pin: rpio.Pin(17)}, 
		1: {ID: 1, Name: "Orangensaft", FlowRate: 20.0, Pin: rpio.Pin(18)},       
		2: {ID: 2, Name: "Gin", FlowRate: 20.0, Pin: rpio.Pin(27)},     
		3: {ID: 3, Name: "Granatapfelsirup", FlowRate: 20.0, Pin: rpio.Pin(22)},
		4: {ID: 4, Name: "Weisser Rum", FlowRate: 20.0, Pin: rpio.Pin(23)},
		5: {ID: 5, Name: "Erdbeersirup", FlowRate: 20.0, Pin: rpio.Pin(25)}, 
		6: {ID: 6, Name: "Limettensirup", FlowRate: 20.0, Pin: rpio.Pin(12)},       
		7: {ID: 7, Name: "Tonic Water", FlowRate: 20.0, Pin: rpio.Pin(13)},     
		8: {ID: 8, Name: "Ananas-Kokos", FlowRate: 20.0, Pin: rpio.Pin(19)},
	}

	// Recepes data
	recipesData := map[int]Recipe{
		1: {
			ID:   1,
			Name: "Wodka-O",
			Ingredients: []Ingredient{
				{PumpID: 0, Volume: 50},  
				{PumpID: 1, Volume: 150}, 
			},
		},
		2: {
			ID:   2,
			Name: "Gin Tonic mit Limette",
			Ingredients: []Ingredient{
				{ PumpID: 2, Volume: 50 },
				{ PumpID: 7, Volume: 130 },
				{ PumpID: 6, Volume: 20 },
			},
		},
		3: {
			ID:   3,
			Name: "Tropischer Rum-Punsch",
			Ingredients: []Ingredient{
				{ PumpID: 4, Volume: 50 },
				{ PumpID: 8, Volume: 120 },
				{ PumpID: 5, Volume: 40 },
			},
		},
		4: {
			ID:   4,
			Name: "Ruby Sunset",
			Ingredients: []Ingredient{
				{ PumpID: 0, Volume: 50 },
				{ PumpID: 1, Volume: 120 },
				{ PumpID: 3, Volume: 30 },
			},
		},
		5: {
			ID:   5,
			Name: "Erdbeer-Gin-Fizz",
			Ingredients: []Ingredient{
				{ PumpID: 2, Volume: 40 },
				{ PumpID: 5, Volume: 30 },
				{ PumpID: 7, Volume: 130 },
			},
		},
		6: {
			ID:   6,
			Name: "Alkoholfreie Pina Colada",
			Ingredients: []Ingredient{
				{ PumpID: 8, Volume: 140 },
				{ PumpID: 1, Volume: 60 },
			},
		},
		7: {
			ID:   7,
			Name: "Erdbeer-Limonade",
			Ingredients: []Ingredient{
				{ PumpID: 7, Volume: 140 },
				{ PumpID: 6, Volume: 30 },
				{ PumpID: 5, Volume: 30 },
			},
		},
		8: {
			ID:   8,
			Name: "Sunrise Mocktail",
			Ingredients: []Ingredient{
				{ PumpID: 1, Volume: 170 },
				{ PumpID: 3, Volume: 30 },
			},
		},
		9: {
			ID:   9,
			Name: "Exotischer Frucht-Mix",
			Ingredients: []Ingredient{
				{ PumpID: 8, Volume: 120 },
				{ PumpID: 1, Volume: 60 },
				{ PumpID: 3, Volume: 20 },
			},
		},
	}

	if err := rpio.Open(); err != nil {
        fmt.Println("⚠️ Симуляция: Запущено на ПК, доступ к GPIO Малинки закрыт")
		app.isRaspberry = false
    } else {
        fmt.Println("✅ Железо обнаружено! Подключились к GPIO Малинки")
        app.isRaspberry = true
        
        for id, pump := range pumpsData {
            pump.Pin.Output()
            pump.Pin.Low() 
            pumpsData[id] = pump 
        }
    }
	app.pumps = pumpsData
    app.recipes = recipesData

	return app
}

func (a *App) PourCocktail(recipeID int) OrderResponse {
	recipe, exists := a.recipes[recipeID]
	if !exists {
		return OrderResponse{
            Status:       fmt.Sprintf("Ошибка: Рецепт '%d' не найден!", recipeID),
            TotalTimeMs:  0,
            CocktailName: "Неизвестный рецепт",
        }
	}

	fmt.Printf("\n=== Начинаем приготовление коктейля: %s ===\n", recipe.Name)
	var maxDurationSeconds float64 = 0

	for _, ingredient := range recipe.Ingredients {

		pump, pumpExists := a.pumps[ingredient.PumpID]
		if !pumpExists {
			fmt.Printf("Ошибка: Помпа %d не настроена в системе!\n", ingredient.PumpID)
			continue 
		}

		// Time calculation
		durationSeconds := float64(ingredient.Volume) / pump.FlowRate
		if durationSeconds > maxDurationSeconds {
            maxDurationSeconds = durationSeconds
        }
		duration := time.Duration(durationSeconds * float64(time.Second))
		fmt.Printf("DEBUG: Наливаем %d мл, время: %v\n", ingredient.Volume, duration)
		// Pump activation
		if a.isRaspberry {
            a.setPump(pump.ID, true)
        }
		fmt.Printf("[ПОМПА %d - %s]: ВКЛЮЧЕНА. Наливаем %d мл. Время: %.2f сек.\n", 
			pump.ID, pump.Name, ingredient.Volume, durationSeconds)

		// Parallel timer
		time.AfterFunc(duration, func() {
			if a.isRaspberry {
            	a.setPump(pump.ID, false)
        	}
			fmt.Printf("[ПОМПА %d - %s]: ВЫКЛЮЧЕНА. Налив завершен.\n", pump.ID, pump.Name)
		})
	}
	totalTimeMs := int64(maxDurationSeconds * 1000)

    return OrderResponse{
        Status:       fmt.Sprintf("Коктейль %s готовится...", recipe.Name),
        TotalTimeMs:  totalTimeMs,
        CocktailName: recipe.Name,
    }
}
func (a *App) PourByBarcode(barcode string) OrderResponse {
	consoleOutput := fmt.Sprintf("Сканирован баркод: '%s'", barcode)
	fmt.Println(consoleOutput)
	if barcode == "sol-admin" || barcode == "solßadmin" {
        return OrderResponse{
            Status: "admin",
			TotalTimeMs:  0,
			CocktailName: "Admin access failure",
        }
    }
	volumesStr := strings.Fields(strings.TrimSpace(barcode))

	if len(volumesStr) != 9 {
		return OrderResponse{
		Status:       fmt.Sprintf("Ошибка: Баркод должен содержать 9 значений, получено: %d", len(volumesStr)),
		TotalTimeMs:  0,
		CocktailName: "Ошибка баркода",
		}
	}
	

	// Start 
	fmt.Println("\n=== [СКАНИРОВАНИЕ] Запуск налива по баркоду ===")
	var maxDurationSeconds float64 = 0
	type pendingPump struct {
			Pump     Pump
			Volume   int
			Duration time.Duration
		}

	// Load current amounts
	amounts, err := a.LoadAmounts()
    if err != nil {
        return OrderResponse{Status: "Ошибка загрузки остатков"}
    }

	// Test of amounts
	for index, volStr := range volumesStr {
        volume, err := strconv.Atoi(volStr)
        if err != nil || volume <= 0 {
            continue
        }

        idStr := strconv.Itoa(index)
        currentAvailable := amounts[idStr] 

        if currentAvailable < volume {
            fmt.Printf("[ОШИБКА] Недостаточно ингредиента на помпе %d. Требуется: %d, доступно: %d\n", index, volume, currentAvailable)
            return OrderResponse{
                Status:       "NoIngredients",
                TotalTimeMs:  0,
                CocktailName: "NoIngredients", 
            }
        }
    }
	
	var pumpsToLaunch []pendingPump

	
	for index, volStr := range volumesStr {
		volume, err := strconv.Atoi(volStr)
		if err != nil {
			fmt.Printf("Ошибка чтения объема '%s' на позиции %d\n", volStr, index)
			continue
		}
		if volume <= 0 {
			continue
		}

		pump, exists := a.pumps[index]
		if !exists {
			fmt.Printf("Критическая ошибка: Помпа с ID %d не найдена в системе!\n", index)
			continue
		}
		
		idStr := strconv.Itoa(index)
		amounts[idStr] -= volume
		

		durationSeconds := float64(volume) / pump.FlowRate
		duration := time.Duration(durationSeconds * float64(time.Second))

		if durationSeconds > maxDurationSeconds {
			maxDurationSeconds = durationSeconds
		}

		pumpsToLaunch = append(pumpsToLaunch, pendingPump{
			Pump:     pump,
			Volume:   volume,
			Duration: duration,
		})
	}
	// New amounts save
	err = a.SaveAmounts(amounts)

		if err != nil {
			fmt.Printf("Ошибка при сохранении amounts.json: %v\n", err)
		}

	for _, p := range pumpsToLaunch {
		if a.isRaspberry {
            a.setPump(p.Pump.ID, true)
        }
		fmt.Printf("[БАРКОД] Помпа %d (%s) ВКЛЮЧЕНА. Налив: %d мл. Время: %.2f сек.\n", 
			p.Pump.ID, p.Pump.Name, p.Volume, p.Duration.Seconds())

		// Go-routine 
		time.AfterFunc(p.Duration, func() {
			if a.isRaspberry {
            	a.setPump(p.Pump.ID, false)
        	}
			fmt.Printf("[БАРКОД] Помпа %d (%s) ВЫКЛЮЧЕНА. Налив завершен.\n", p.Pump.ID, p.Pump.Name)
		})
	}

	totalTimeMs := int64(maxDurationSeconds * 1000)

	return OrderResponse{
		Status:       "Коктейль успешно готовится!",
		TotalTimeMs:  totalTimeMs,
		CocktailName: "Wunsch-Mix",
	}
}


func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type Ingredient struct {
	PumpID int `json:"pumpId"` 
	Volume int `json:"volume"` 
}

type Recipe struct {
	ID          int       `json:"id"`        
	Name        string       `json:"name"`        
	Ingredients []Ingredient `json:"ingredients"` 
}